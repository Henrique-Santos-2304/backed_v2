import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  ITokenValidator,
} from "@root/domain";
import { FarmModel, UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";

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
    let users: UserModel[] = [];

    const [sudo, farm] = await Promise.all([
      this.#baseRepo.findOne<UserModel>({
        column: DB_TABLES.USERS,
        where: "login",
        equals: "soil",
      }),
      this.#baseRepo.findOne<FarmModel>({
        column: DB_TABLES.FARMS,
        where: "farm_id",
        equals: farm_id,
      }),
    ]);

    if (!farm) {
      this.#console.error("Fazenda não encontrada!");
      return { topic: `${farm_id}_0_InitialData`, message: "1000-404" };
    }

    const [pivots, owner] = await Promise.all([
      this.#baseRepo.findAllByData({
        column: DB_TABLES.PIVOTS,
        where: "farm_id",
        equals: farm?.farm_id,
      }),
      this.#baseRepo.findOne<UserModel>({
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: farm?.user_id,
      }),
    ]);

    if (farm?.dealer && farm?.dealer !== "none") {
      dealer = await this.#baseRepo.findOne<UserModel>({
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: farm?.dealer,
      });
    }

    if (farm?.users && farm?.users.length > 0) {
      for (let us of users) {
        const newUser = await this.#baseRepo.findOne<UserModel>({
          column: DB_TABLES.USERS,
          where: "user_id",
          equals: us?.user_id!,
        });

        if (!newUser) return;
        users = [
          ...users,
          { ...newUser, password: this.#token.decrypt(newUser?.secret!) },
        ];
      }
    }

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
