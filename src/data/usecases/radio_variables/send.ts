import {
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
} from "@root/domain";
import { checkPivotExist } from "../pivots/helpers";
import { Injector } from "@root/main/injector";
import {
  IDPS,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";
import { ISendRadioVariableExec } from "@root/domain/usecases";

export class SendRadioVariables implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #observable: IObservables;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#observable =
      this.#observable ?? Injector.get(INJECTOR_OBSERVABLES.GATEWAY_COMM);
  }

  execute: ISendRadioVariableExec = async ({ pivot_id, type }) => {
    this.initInstances();

    const piv = await checkPivotExist(this.#baseRepo.findOne, pivot_id);

    if (piv.is_gprs) return;
    const idps = IDPS as { [key: string]: string };

    await this.#iot.publisher(
      `${piv?.farm_id}_0`,
      `#${idps[type.toUpperCase()]}-${piv?.radio_id}`
    );

    this.#observable.subscribe(idps[type.toUpperCase()], pivot_id);
  };
}
