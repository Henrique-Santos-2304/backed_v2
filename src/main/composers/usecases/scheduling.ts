import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

import {
  SaveSchedulingHistory,
  InitScheduleByDate,
  InitScheduleByAngle,
  CreateSchedulingUseCase,
  UpdateSchedulingUseCase,
  GetSchedulingsPendingUseCase,
  DeleteSchedulingUseCase,
} from "@root/data/usecases";

export const injectSchedulingCases = async () => {
  Injector.add(new SaveSchedulingHistory(), INJECTOR_CASES.SCHEDULE.SAVE);
  Injector.add(new InitScheduleByAngle(), INJECTOR_CASES.SCHEDULE.INIT_ANGLE);
  Injector.add(new InitScheduleByDate(), INJECTOR_CASES.SCHEDULE.INIT_DATE);
  Injector.add(new CreateSchedulingUseCase(), INJECTOR_CASES.SCHEDULE.CREATE);
  Injector.add(new UpdateSchedulingUseCase(), INJECTOR_CASES.SCHEDULE.UPDATE);
  Injector.add(new DeleteSchedulingUseCase(), INJECTOR_CASES.SCHEDULE.DELETE);

  Injector.add(
    new GetSchedulingsPendingUseCase(),
    INJECTOR_CASES.SCHEDULE.GET_ALL
  );
};
