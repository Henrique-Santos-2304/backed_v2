import { Farm } from "@prisma/client";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  ITokenValidator,
} from "@root/domain";
import { PivotModel, UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";

export class GetInitialDataGateway implements IBaseUseCases<string> {
  #baseRepo: IBaseRepository;
  #token: ITokenValidator;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#token = this.#token ?? Injector.get(INJECTOR_COMMONS.APP_TOKEN);
  }

  async execute(farm_id: string) {
    this.initInstances();

    this.#console.warn(
      `Buscando configuração inciial de concentrador para fazenda ${farm_id}`
    );

    let dealer: UserModel | null = null;

    const [sudo, farm] = await Promise.all([
      this.#baseRepo.findOne<UserModel>(DB_TABLES.USERS, { login: "soil" }),
      this.#baseRepo.findOne<Farm>(DB_TABLES.FARMS, {}),
    ]);

    if (!farm) {
      this.#console.error("Fazenda não encontrada!");
      return { topic: `${farm_id}_0_InitialData`, message: "1000-404" };
    }

    const [pivots, owner] = await Promise.all([
      this.#baseRepo.findAllByData<PivotModel>(DB_TABLES.PIVOTS, { farm_id }),
      this.#baseRepo.findOne<UserModel>(DB_TABLES.USERS, {
        user_id: farm?.user_id,
      }),
    ]);

    if (farm?.dealer && farm?.dealer !== "none") {
      dealer = await this.#baseRepo.findOne<UserModel>(DB_TABLES.USERS, {
        user_id: farm?.dealer,
      });
    }

    const users = Injector.get(INJECTOR_CASES.FARMS.GET_USERS).execute(farm_id);

    const userSudo = {
      ...sudo,
      username: sudo.login,
      password: sudo?.secret! ? this.#token.decrypt(sudo?.secret!) : "",
    };

    const userOwner = {
      ...owner,
      username: owner?.login,
      password: owner?.secret! ? this.#token.decrypt(owner?.secret!) : "",
    };

    const userDealer = !dealer
      ? null
      : {
          ...dealer,
          username: dealer?.login,
          password: dealer?.secret! ? this.#token.decrypt(dealer?.secret!) : "",
        };

    this.#console.log("Configuração finalizada com sucesso");

    return {
      topic: `${farm?.farm_id}_0_InitialData`,
      message: JSON.stringify({
        SUDO: userSudo,
        OWNER: userOwner,
        FARM: farm,
        DEALER: userDealer,
        USERS: users,
        PIVOTS: pivots,
      }),
    };
  }
}
