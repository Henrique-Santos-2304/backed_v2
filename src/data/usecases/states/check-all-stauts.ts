import { IAppLog, IBaseUseCases } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES, INJECTOR_COMMONS } from "@root/shared";

export class CheckAllStatus implements IBaseUseCases {
  #checkPivot: IBaseUseCases<string>;
  #console: IAppLog;

  private initInstances() {
    this.#checkPivot = Injector.get(INJECTOR_CASES.STATES.CHECK_STATUS);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  async execute({ pivots }: { pivots: string[] }) {
    this.initInstances();
    this.#console.warn("Iniciando checagem dos pivôs\n");

    pivots?.forEach((piv) => {
      this.#checkPivot.execute(piv);
    });

    return;
  }
}
