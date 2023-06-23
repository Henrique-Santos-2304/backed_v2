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
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IDelPivotExecute = async ({ pivot_id, isGateway }) => {
    this.initInstances();

    this.#console.log(`Deletando pivô ${pivot_id}`);

    const { farm_id } = await checkPivotExist(this.#baseRepo.findOne, pivot_id);

    await this.#baseRepo.delete({
      column: DB_TABLES.PIVOTS,
      where: "pivot_id",
      equals: pivot_id,
    });

    if (!isGateway) return;

    await this.#iot?.publisher(`${farm_id}_0`, `#2002:D-${pivot_id}`);
    this.#console.log(`Pivô deletado com sucesso`);
  };
}
