import { Injector } from "@root/main/injector";
import {
  CreateActionController,
  GetHistoryCycleController,
} from "@root/presentation";

import { INJECTOR_CONTROLS } from "@root/shared";

export const injectStatesControls = async () => {
  Injector.add(new CreateActionController(), INJECTOR_CONTROLS.STATES.ACTION);

  Injector.add(
    new GetHistoryCycleController(),
    INJECTOR_CONTROLS.STATES.GET_HISTORY
  );
};
