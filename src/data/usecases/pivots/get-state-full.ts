import { IAppDate, IBaseRepository, IBaseUseCases } from "@root/domain";
import { checkPivotExist } from "./helpers";
import { getLastState } from "./helpers/get-last-state";
import { IGetPivotFull } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";
import { INJECTOR_REPOS } from "@root/shared";

export class GetPivotFull implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetPivotFull = async (pivot_id: string) => {
    this.initInstances();

    const pivot = await checkPivotExist(this.#baseRepo.findOne, pivot_id);
    const lastState = await getLastState(pivot);

    return {
      pivot: { ...pivot, last_state_timestamp: lastState.last_timestamp },
      state: {
        power: lastState.power,
        water: lastState?.water,
        direction: lastState?.direction,
        connection: lastState?.connection,
      },
      variable: {
        percentimeter: lastState?.percentimeter,
        angle: lastState?.angle,
      },
      timestamp: lastState.last_timestamp,
    };
  };
}
