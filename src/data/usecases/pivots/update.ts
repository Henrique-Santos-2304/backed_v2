import { IAppLog, IBaseRepository, IIotConnect } from "@root/domain";
import { IPutPivotExecute } from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { checkPivotExist } from "./helpers/check-pivots";
import { MutationPivotVO } from "@root/infra/value-objects/pivot";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class UpdatePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  createEntity(oldData: PivotModel, newDate: PivotModel) {
    const vo = new MutationPivotVO();
    return vo.update(oldData, newDate).find();
  }

  execute: IPutPivotExecute = async ({ pivot, isGateway }) => {
    this.initInstances();

    this.#console.log(`Iniciando atualização do pivô ${pivot?.id}`);
    const oldPivot = await checkPivotExist(pivot?.id);
    const newPivot = this.createEntity(oldPivot, pivot);

    await this.#baseRepo.update(DB_TABLES.PIVOTS, { id: pivot?.id }, newPivot);

    if (isGateway) {
      await this.#iot?.publisher(
        `${pivot?.farm_id}_0`,
        JSON.stringify({
          type: "PUT_PIVOT",
          newPivot,
        })
      );
    }

    this.#console.log("Atualização finalizada com sucesso... \n");

    return newPivot;
  };
}
