import { IBaseUseCases } from "@root/domain";
import { checkPivotExist } from "./helpers";
import { getLastState } from "./helpers/get-last-state";
import { IGetPivotFull } from "@root/domain/usecases";
import { getLastStateFull } from "../states/helpers/get-state";

export class GetPivotFull implements IBaseUseCases {
  execute: IGetPivotFull = async (pivot_id: string) => {
    const pivot = await checkPivotExist(pivot_id);
    const lastState = await getLastState(pivot);
    const lastStateFull = await getLastStateFull(pivot_id);

    return {
      pivot: { ...pivot, last_state_timestamp: lastState.last_timestamp },
      state: {
        start_angle: lastStateFull?.start_angle || 0,
        power: lastState.power,
        water: lastState?.water,
        direction: lastState?.direction,
        connection: lastState?.connection,
        timestamp: lastState.last_timestamp,
        pressure: lastState.pressure,
        last_state_timestamp: lastState.last_timestamp,
      },
      variable: {
        percentimeter: lastState?.percentimeter,
        angle: lastState?.angle,
        timestamp: lastState.last_timestamp,
        last_state_timestamp: lastState.last_timestamp,
      },
      timestamp: lastState.last_timestamp,
    };
  };
}
