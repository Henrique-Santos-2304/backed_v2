import {
  IAppLog,
  IBaseUseCases,
  IIotConnect,
  IObservables,
  StatusObservablesType,
} from "@root/domain";
import { checkPivotExist } from "../usecases/pivots/helpers";
import {
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
} from "@root/shared";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";

export class CheckStatusGprs implements IBaseUseCases {
  #iot: IIotConnect;
  #observable: IObservables<StatusObservablesType>;
  #saveConnFalse: IBaseUseCases<{ payload: string }>;
  #console: IAppLog;

  private initInstances() {
    this.#observable = Injector.get(INJECTOR_OBSERVABLES.STATUS);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#saveConnFalse = Injector.get(
      INJECTOR_CASES.PIVOTS.SAVE_CONNECTION_FALSE
    );
  }

  private async failStatus(pivot: PivotModel) {
    const console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    const saveConnFalse = Injector.get(
      INJECTOR_CASES.PIVOTS.SAVE_CONNECTION_FALSE
    );

    console.warn(`Ack não recebido para o pivô ${pivot?.pivot_id} `);
    await saveConnFalse.execute({ payload: pivot?.pivot_id });
  }

  private publisher(pivot: PivotModel) {
    const iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);

    const topic = pivot?.is_gprs ? pivot?.pivot_id : `${pivot?.farm_id}_0`;

    iot.publisher(topic, `#${IDPS.STATUS}-${pivot?.pivot_num}$`);

    if (pivot?.is_gprs) {
      iot.publisher(
        topic,
        JSON.stringify({
          payload: "000-000",
          type: "status",
          id: pivot?.pivot_id,
        })
      );
    }
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
