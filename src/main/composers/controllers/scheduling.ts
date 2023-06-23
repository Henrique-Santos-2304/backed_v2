import { Injector } from "@root/main/injector";
import { CreateScehdulingController } from "@root/presentation/controllers/schedulings";
import { INJECTOR_CONTROLS } from "@root/shared";

export const injectSchedulingControls = async () => {
  Injector.add(
    new CreateScehdulingController(),
    INJECTOR_CONTROLS.SCHEDULE.CREATE
  );
};
