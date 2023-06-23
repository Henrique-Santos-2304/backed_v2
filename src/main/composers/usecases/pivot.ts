import {
  CreatePivotUseCase,
  DeletePivotUseCase,
  GetAllPivotUseCase,
  GetAllPivotsFull,
  GetPivotFull,
  SaveLastStatePivotUseCase,
  UpdatePivotUseCase,
} from "@root/data/usecases/pivots";
import { Injector } from "@root/main/injector";

import { INJECTOR_CASES } from "@root/shared";

export const injectPivotsCases = async () => {
  Injector.add(new CreatePivotUseCase(), INJECTOR_CASES.PIVOTS.CREATE);
  Injector.add(new DeletePivotUseCase(), INJECTOR_CASES.PIVOTS.DELETE);
  Injector.add(new UpdatePivotUseCase(), INJECTOR_CASES.PIVOTS.PUT);

  Injector.add(new GetAllPivotUseCase(), INJECTOR_CASES.PIVOTS.GET_ALL);
  Injector.add(new GetPivotFull(), INJECTOR_CASES.PIVOTS.GET_FULL);
  Injector.add(new GetAllPivotsFull(), INJECTOR_CASES.PIVOTS.GET_ALL_FULL);
  Injector.add(
    new SaveLastStatePivotUseCase(),
    INJECTOR_CASES.PIVOTS.SAVE_LAST_STATE
  );
};
