import { FarmModel } from "@db/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { IDelUserToFarmExecute } from "@contracts/usecases";
import { IBaseRepository, IIotConnect } from "@root/domain";
import { Injector } from "@root/main/injector";

export class DelUserIntoFarmUseCase {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IDelUserToFarmExecute = async (data) => {
    this.initInstances();

    const farm = await this.#baseRepo.findOne<FarmModel>(DB_TABLES.FARMS, {
      id: data.id,
    });

    const exists = farm?.workers?.find((p) => p === data.worker);

    if (!exists) return farm;

    const newFarm = await this.#baseRepo.update<FarmModel>(
      DB_TABLES.FARMS,
      { id: data.id },
      { workers: farm?.workers?.filter((u) => u !== data.worker) || [] }
    );

    await this.#baseRepo.delete(DB_TABLES.USERS, { username: data.worker });

    if (!data?.isGateway) {
      await this.#iot?.publisher(
        `${farm?.id}_0`,
        JSON.stringify({
          type: "DEL_WORKER",
          worker: data.worker,
        })
      );
    }

    return newFarm;
  };
}
