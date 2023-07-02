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
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iotConnect = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IDelFarmExecute = async (farm_id) => {
    this.initInstances();

    this.#console.warn(`Deletando fazenda ${farm_id}`);
    await checkFarmExist(farm_id);

    await this.#baseRepo.delete(DB_TABLES.FARMS, { farm_id });

    await this.#iotConnect.publisher(`${farm_id}_0`, `2001:D-${farm_id}`);

    this.#console.warn(`Fazenda deletada com sucesso`);
  };
}
