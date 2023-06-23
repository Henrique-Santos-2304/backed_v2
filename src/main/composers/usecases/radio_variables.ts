import { SaveRadioVariableUseCase, SendRadioVariables } from "@root/data";
import { Injector } from "@root/main/injector";

import { INJECTOR_CASES } from "@root/shared";

export const injectRadioVariablesCases = async () => {
  Injector.add(new SendRadioVariables(), INJECTOR_CASES.RADIO_VARIABLES.SEND);
  Injector.add(
    new SaveRadioVariableUseCase(),
    INJECTOR_CASES.RADIO_VARIABLES.SAVE
  );
};
