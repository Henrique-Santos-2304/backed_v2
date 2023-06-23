import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

import {
  SaveSchedulingHistory,
  InitScheduleByDate,
  InitScheduleByAngle,
  CreateSchedulingUseCase,
  UpdateSchedulingUseCase,
} from "@root/data/usecases";

export const injectSchedulingCases = async () => {
  Injector.add(new SaveSchedulingHistory(), INJECTOR_CASES.SCHEDULE.SAVE);
  Injector.add(new InitScheduleByAngle(), INJECTOR_CASES.SCHEDULE.INIT_ANGLE);
  Injector.add(new InitScheduleByDate(), INJECTOR_CASES.SCHEDULE.INIT_DATE);
  Injector.add(new CreateSchedulingUseCase(), INJECTOR_CASES.SCHEDULE.CREATE);
  Injector.add(new UpdateSchedulingUseCase(), INJECTOR_CASES.SCHEDULE.UPDATE);
};
