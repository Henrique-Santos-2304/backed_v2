import {
  AngleJobObservable,
  CreateActionObservable,
  CreateScheduleObservable,
  GatewayComunicattionObservable,
  PressureObservable,
  StatusObservable,
} from "@root/data";
import { Injector } from "../injector";
import { INJECTOR_OBSERVABLES } from "@root/shared";

export const injectObservables = async () => {
  Injector.add(
    new GatewayComunicattionObservable(),
    INJECTOR_OBSERVABLES.GATEWAY_COMM
  );
  Injector.add(new StatusObservable(), INJECTOR_OBSERVABLES.STATUS);
  Injector.add(new CreateActionObservable(), INJECTOR_OBSERVABLES.ACTION);
  Injector.add(new CreateScheduleObservable(), INJECTOR_OBSERVABLES.SCHEDULE);
  Injector.add(new AngleJobObservable(), INJECTOR_OBSERVABLES.ANGLE_JOB);
};
