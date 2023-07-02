import { IAppLog, IBaseRepository, IIotConnect } from "@root/domain";
import { IDelPivotExecute } from "@root/domain/usecases";
import { checkPivotExist } from "./helpers/check-pivots";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class DeletePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IDelPivotExecute = async ({ pivot_id, isGateway }) => {
    this.initInstances();

    this.#console.log(`Deletando pivô ${pivot_id}`);

    const { farm_id } = await checkPivotExist(pivot_id);

    await this.#baseRepo.delete(DB_TABLES.PIVOTS, { pivot_id });

    if (!isGateway) return;

    await this.#iot?.publisher(`${farm_id}_0`, `#2002:D-${pivot_id}`);
    this.#console.log(`Pivô deletado com sucesso`);
  };
}
