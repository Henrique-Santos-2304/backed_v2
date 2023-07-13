import {
  CreatePivotUseCase,
  DeletePivotUseCase,
  GetAllPivotUseCase,
  GetOnePivot,
  SaveConnectionFalsePivotUseCase,
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
  Injector.add(new GetOnePivot(), INJECTOR_CASES.PIVOTS.GET_ONE);

  Injector.add(
    new SaveConnectionFalsePivotUseCase(),
    INJECTOR_CASES.PIVOTS.SAVE_CONNECTION_FALSE
  );

  Injector.add(
    new SaveLastStatePivotUseCase(),
    INJECTOR_CASES.PIVOTS.SAVE_LAST_STATE
  );
};
