import { Injector } from "@root/main/injector";
import { SendRadioVariableController } from "@root/presentation";

import { INJECTOR_CONTROLS } from "@root/shared";

export const injectRadioVariablesControls = async () => {
  Injector.add(
    new SendRadioVariableController(),
    INJECTOR_CONTROLS.RADIO_VARIABLES.SEND
  );
};
