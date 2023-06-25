import { Injector } from "@root/main/injector";
import {
  CreateScehdulingController,
  DelSchedulingController,
  GetSchedulingsByAngleController,
  GetSchedulingsByDateController,
  PutSchedulingController,
} from "@root/presentation/controllers/schedulings";
import { INJECTOR_CONTROLS } from "@root/shared";

export const injectSchedulingControls = async () => {
  Injector.add(
    new CreateScehdulingController(),
    INJECTOR_CONTROLS.SCHEDULE.CREATE
  );

  Injector.add(
    new PutSchedulingController(),
    INJECTOR_CONTROLS.SCHEDULE.UPDATE
  );

  Injector.add(
    new DelSchedulingController(),
    INJECTOR_CONTROLS.SCHEDULE.DELETE
  );

  Injector.add(
    new GetSchedulingsByDateController(),
    INJECTOR_CONTROLS.SCHEDULE.GET_ALL_BY_DATE
  );

  Injector.add(
    new GetSchedulingsByAngleController(),
    INJECTOR_CONTROLS.SCHEDULE.GET_ALL_BY_ANGLE
  );
};
