import { Injector } from "@root/main/injector";
import {
  CheckStatusController,
  CreateActionController,
  GetHistoryCycleController,
} from "@root/presentation";

import { INJECTOR_CONTROLS } from "@root/shared";

export const injectStatesControls = async () => {
  Injector.add(new CreateActionController(), INJECTOR_CONTROLS.STATES.ACTION);
  Injector.add(
    new CheckStatusController(),
    INJECTOR_CONTROLS.STATES.CHECK_ALL_STATUS
  );
  Injector.add(
    new GetHistoryCycleController(),
    INJECTOR_CONTROLS.STATES.GET_HISTORY
  );
};
