import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
  StatusObservablesType,
} from "@root/domain";
import { checkPivotExist } from "../usecases/pivots/helpers";
import {
  DB_TABLES,
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";
import { ConnectionModel, PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { MutationConnectionVO } from "@root/infra";

export class CheckStatusGprs implements IBaseUseCases {
  #observable: IObservables<StatusObservablesType>;

  private initInstances() {
    this.#observable = Injector.get(INJECTOR_OBSERVABLES.STATUS);
  }

  private async failStatus(pivot: PivotModel) {
    const console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    const saveConnectionFalse = Injector.get<IBaseUseCases>(
      INJECTOR_CASES.PIVOTS.SAVE_CONNECTION_FALSE
    );

    console.warn(`Ack não recebido para o pivô ${pivot?.id} `);
    await saveConnectionFalse.execute({ id: pivot?.id });
  }

  private publisher(pivot: PivotModel) {
    const iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);

    const topic = pivot?.is_gprs ? pivot?.id : `${pivot?.farm_id}_0`;

    if (pivot?.is_gprs) {
      iot.publisher(topic, `#${IDPS.STATUS}-${pivot?.id}$`);
      iot.publisher(
        topic,
        JSON.stringify({
          payload: "000-000",
          type: "status",
          id: pivot?.id,
        })
      );

      return;
    }

    iot.publisher(topic, `#${IDPS.STATUS}-${pivot?.num}$`);
  }

  async execute(pivot_id: string): Promise<any> {
    this.initInstances();

    const pivot = await checkPivotExist(pivot_id);

    this.#observable.subscribe({
      pivot,
      iot: this.publisher,
      attempts: 1,
      cbFail: this.failStatus,
    });
  }
}
