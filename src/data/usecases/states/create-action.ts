import {
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
} from "@root/domain";
import { ActionProps, ICreateActionExecute } from "@root/domain/usecases";
import { checkPivotExist } from "../pivots/helpers";
import { Injector } from "@root/main/injector";
import {
  IDPS,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";

export class CreateActionUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #actionObserver: IObservables;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#actionObserver =
      this.#actionObserver ?? Injector.get(INJECTOR_OBSERVABLES.ACTION);
  }

  private mountAction(action: ActionProps) {
    let message = "";

    message += action?.direction === "CLOCKWISE" ? 3 : 4;
    message += action?.water ? 5 : 6;
    message += action?.power ? 1 : 2;
    message += "-";
    message += action?.percentimeter.toString().padStart(3, "0");
    message += "-";
    message += new Date().valueOf();
    return message;
  }

  execute: ICreateActionExecute = async ({ action, isGateway }) => {
    this.initInstances();
    const piv = await checkPivotExist(this.#baseRepo.findOne, action?.pivot_id);

    const topic = piv?.is_gprs ? piv?.pivot_id : `${piv?.farm_id}_0`;
    const message = `#${IDPS.COMANDS}-${piv?.pivot_num}-${this.mountAction(
      action
    )}-${action?.author || "Manual"}$`;
    await this.#iot.publisher(topic, message);

    this.#actionObserver.subscribe({ action, topic, message });
  };
}
