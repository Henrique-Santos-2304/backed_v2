import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";

import {
  CreatePivotController,
  DelPivotController,
  GetAllPivotController,
  GetPivotFullController,
  UpdatePivotController,
} from "@root/presentation";

export const injectPivotsControls = async () => {
  Injector.add(new CreatePivotController(), INJECTOR_CONTROLS.PIVOTS.CREATE);
  Injector.add(new DelPivotController(), INJECTOR_CONTROLS.PIVOTS.DELETE);
  Injector.add(new UpdatePivotController(), INJECTOR_CONTROLS.PIVOTS.PUT);

  Injector.add(new GetAllPivotController(), INJECTOR_CONTROLS.PIVOTS.GET_ALL);
  Injector.add(new GetPivotFullController(), INJECTOR_CONTROLS.PIVOTS.GET_ONE);
};
