import {
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
};
