import { injectFarmControls } from "./farm";
import { injectPivotsControls } from "./pivot";
import { injectRadioVariablesControls } from "./radio-variables";
import { injectSchedulingControls } from "./scheduling";
import { injectStatesControls } from "./state";
import { injectUsersControls } from "./user";

export const injectControllers = async () => {
  await injectUsersControls();
  await injectFarmControls();
  await injectPivotsControls();
  await injectStatesControls();
  await injectRadioVariablesControls();
  await injectSchedulingControls();
};
