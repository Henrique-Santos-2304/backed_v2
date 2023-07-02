import {
  IBaseUseCases,
  IIotConnect,
  IObservables,
  IWriteLogs,
} from "@root/domain";
import { ActionProps, ICreateActionExecute } from "@root/domain/usecases";
import { checkPivotExist } from "../pivots/helpers";
import { Injector } from "@root/main/injector";
import { IDPS, INJECTOR_COMMONS, INJECTOR_OBSERVABLES } from "@root/shared";
import { PivotModel } from "@root/infra/models";

export class CreateActionUseCase implements IBaseUseCases {
  #iot: IIotConnect;
  #actionObserver: IObservables;

  private initInstances() {
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#actionObserver = Injector.get(INJECTOR_OBSERVABLES.ACTION);
  }

  private mountAction(action: ActionProps) {
    const percent = action?.percentimeter.toString().padStart(3, "0");
    const date = new Date().valueOf();

    if (action?.power) return `002-${percent}-${date}`;

    let message = "";

    message += action?.direction === "CLOCKWISE" ? 3 : 4;
    message += action?.water ? 5 : 6;
    message += action?.power ? 1 : 2;
    message += "-";
    message += percent;
    message += "-";
    message += date;

    return message;
  }

  private async sendToOldTypeMessage(action: ActionProps, piv: PivotModel) {
    const message = {
      type: "action",
      id: action?.pivot_id,
      pivot_num: piv?.pivot_num,
      author: action?.author,
      payload: this.mountAction(action),
      attempts: 1,
    };

    await this.#iot.publisher(piv?.pivot_id, JSON.stringify(message));
  }

  execute: ICreateActionExecute = async ({ action, isGateway }) => {
    this.initInstances();
    const piv = await checkPivotExist(action?.pivot_id);

    const topic = piv?.is_gprs ? piv?.pivot_id : `${piv?.farm_id}_0`;

    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "ACTION",
      piv?.pivot_id,
      JSON.stringify(action)
    );
    const oldMessage = `#${IDPS.COMANDS}-${piv?.pivot_num}-${this.mountAction(
      action
    )}-${action?.author || "Manual"}$`;

    await this.#iot.publisher(topic, oldMessage);

    if (piv?.is_gprs) await this.sendToOldTypeMessage(action, piv);

    this.#actionObserver.subscribe({ action, topic, oldMessage });
  };
}
