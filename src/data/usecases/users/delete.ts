import { IAppLog, IBaseRepository, IBaseUseCases } from "@root/domain";
import { IDelUserExecute } from "@root/domain/usecases";
import { FarmModel, UserModel } from "@root/infra/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";
import { checkUserExists } from "./helpers";

export class DeleteUserUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  private async delUser(id: string) {
    await this.#baseRepo.delete<UserModel>(DB_TABLES.USERS, { id });
  }

  private async putFarm(farm: FarmModel) {
    await this.#baseRepo.update<FarmModel>(
      DB_TABLES.FARMS,
      { id: farm?.id },
      farm
    );
  }

  private async getFarmsUserDealer(dealer: string) {
    const farms = await this.#baseRepo.findAllByData<FarmModel>(
      DB_TABLES.FARMS,
      { dealer }
    );

    if (farms?.length <= 0) return;

    for (let farm of farms) {
      await this.putFarm({ ...farm, dealer: null });
    }
  }

  private async getFarmsUserWork(user_id: string) {
    const farms = (await this.#baseRepo.findAllByData(DB_TABLES.FARMS, {
      workers: { has: user_id },
    })) as unknown as FarmModel[];

    if (farms?.length <= 0) return;

    for (let farm of farms) {
      await this.putFarm({
        ...farm,
        workers: farm?.workers?.filter((f) => f !== user_id) || [],
      });
    }
  }

  execute: IDelUserExecute = async (user_id) => {
    this.initInstances();

    this.#console.log("Iniciando deleção de usuário");
    const user = await checkUserExists({ id: user_id });

    if (user?.user_type === "DEALER") {
      await this.getFarmsUserDealer(user_id);
    }

    await this.getFarmsUserWork(user_id);
    this.#console.log("Finalizando deleção de usuário\n");

    return await this.delUser(user_id);
  };
}
