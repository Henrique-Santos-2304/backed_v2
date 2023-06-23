import { IAppLog, IBaseRepository, IIotConnect } from "@root/domain";
import { IDelFarmExecute } from "@root/domain/usecases";
import { checkFarmExist } from "./helpers";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class DeleteFarmUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iotConnect: IIotConnect;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iotConnect =
      this.#iotConnect ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IDelFarmExecute = async (farm_id) => {
    this.initInstances();

    this.#console.warn(`Deletando fazenda ${farm_id}`);
    await checkFarmExist(this.#baseRepo.findOne, farm_id);

    await this.#baseRepo.delete({
      column: DB_TABLES.FARMS,
      where: "farm_id",
      equals: farm_id,
    });

    await this.#iotConnect.publisher(`${farm_id}_0`, `2001:D-${farm_id}`);

    this.#console.warn(`Fazenda deletada com sucesso`);
  };
}
