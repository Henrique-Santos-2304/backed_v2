import { AngleSubscribe, IBaseScheduleCase, IObservables } from "@root/domain";
import { INJECTOR_OBSERVABLES } from "@root/shared";
import { SchedulerSendAction } from "./helpers/send-action";
import { Injector } from "@root/main/injector";

export class InitScheduleByAngle implements IBaseScheduleCase {
  sendJob: IBaseScheduleCase["sendJob"] = async ({ job, is_stop = true }) => {
    try {
      SchedulerSendAction.start({ job, is_stop });

      if (is_stop) return;

      const observer = Injector.get<IObservables<AngleSubscribe>>(
        INJECTOR_OBSERVABLES.ANGLE_JOB
      );

      return observer.subscribe({
        pivot_id: job?.pivot_id,
        requiredAngle: job?.end_angle!,
        cb: () => SchedulerSendAction.start({ job, is_stop: true }),
      });
    } catch (error) {
      console.warn("ERROR! .....");
      console.error(error.message);
    }
  };
}
