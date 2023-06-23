import {
  CreateStateVariableUseCase,
  GetAllStateVariableUseCase,
} from "@root/data/usecases";
import { Injector } from "@root/main/injector";

import { INJECTOR_CASES } from "@root/shared";

export const injectStateVariablesCases = async () => {
  Injector.add(
    new CreateStateVariableUseCase(),
    INJECTOR_CASES.STATE_VARIABLES.CREATE
  );
  Injector.add(
    new GetAllStateVariableUseCase(),
    INJECTOR_CASES.STATE_VARIABLES.GET_ALL
  );
};
