import { Injector } from "@root/main/injector";
import { PivotModel } from "@root/infra/models";
import { checkPivotExist } from "../pivots/helpers";
import { ICreateActionExecute } from "@root/domain/usecases";

import {
  IBaseUseCases,
  IIotConnect,
  IObservables,
  IWriteLogs,
} from "@root/domain";

import {
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  splitMsgCloud,
} from "@root/shared";

export class CreateActionUseCase implements IBaseUseCases {
  #iot: IIotConnect;
  #actionObserver: IObservables;

  private initInstances() {
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#actionObserver = Injector.get(INJECTOR_OBSERVABLES.ACTION);
  }

  private async sendToOldTypeMessage(action: string[], num: PivotModel["num"]) {
    const [_, id, state, percent, author] = action;

    await this.#iot.publisher(
      id,
      JSON.stringify({
        type: "action",
        id,
        pivot_num: num,
        author,
        payload: `${state}-${percent}-${new Date().valueOf()}`,
        attempts: 1,
      })
    );
  }

  execute: ICreateActionExecute = async ({ action, isGateway }) => {
    this.initInstances();
    const { toList } = splitMsgCloud(action);

    if (toList?.length !== 5) throw new Error("Padrão de mensagem inválido");

    const piv = await checkPivotExist(toList[1]);

    const topic = piv?.is_gprs ? piv?.id : `${piv?.farm_id}_0`;

    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "ACTION",
      piv?.id,
      JSON.stringify(action)
    );

    await this.#iot.publisher(topic, action);

    if (piv?.is_gprs) await this.sendToOldTypeMessage(toList, piv?.num);

    this.#actionObserver.subscribe({ action, topic, oldMessage: action });
  };
}
