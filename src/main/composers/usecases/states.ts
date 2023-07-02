import { CheckStatusGprs } from "@root/data";
import {
  CheckAllStatus,
  CheckPressure,
  CreateActionUseCase,
  CreateStateUseCase,
  GetAllStatesUseCase,
  GetHistoryStateOfPivot,
} from "@root/data/usecases";

import { Injector } from "@root/main/injector";

import { INJECTOR_CASES } from "@root/shared";

export const injectStatesCases = async () => {
  Injector.add(new CreateStateUseCase(), INJECTOR_CASES.STATES.CREATE);
  Injector.add(new GetAllStatesUseCase(), INJECTOR_CASES.STATES.GET_ALL);
  Injector.add(new GetHistoryStateOfPivot(), INJECTOR_CASES.STATES.GET_HISTORY);
  Injector.add(new CreateActionUseCase(), INJECTOR_CASES.STATES.ACTION);
  Injector.add(new CheckStatusGprs(), INJECTOR_CASES.STATES.CHECK_STATUS);
  Injector.add(new CheckAllStatus(), INJECTOR_CASES.STATES.CHECK_ALL_STATUS);
  Injector.add(new CheckPressure(), INJECTOR_CASES.STATES.PRESSURE);
};
