import { injectCommonsCases } from "./commons";
import { injectFarmCases } from "./farm";
import { injectPivotsCases } from "./pivot";
import { injectRadioVariablesCases } from "./radio_variables";
import { injectSchedulingCases } from "./scheduling";
import { injectStateVariablesCases } from "./state_variables";
import { injectStatesCases } from "./states";
import { injectUsersCases } from "./user";

export const injectUseCases = async () => {
  await injectCommonsCases();
  await injectUsersCases();
  await injectFarmCases();
  await injectPivotsCases();
  await injectStatesCases();
  await injectStateVariablesCases();
  await injectRadioVariablesCases();
  await injectSchedulingCases();
};
