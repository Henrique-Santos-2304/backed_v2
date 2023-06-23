import {
  AngleSubscribe,
  IBaseScheduleCase,
  IObservables,
  IScheduler,
} from "@root/domain";
import { SchedulingModel } from "@root/infra/models";
import { INJECTOR_CASES, INJECTOR_OBSERVABLES } from "@root/shared";
import { SchedulerSendAction } from "./helpers/send-action";
import { Injector } from "@root/main/injector";

export class InitScheduleByDate implements IBaseScheduleCase {
  #scheduler: IScheduler;

  private finishByDate(job: SchedulingModel) {
    return this.#scheduler.start({
      id: `${job?.pivot_id}-${job?.scheduling_id}-end`,
      date: job?.end_timestamp!,
      cb: SchedulerSendAction.start,
      dataBind: { job, is_stop: true },
    });
  }

  private finishByAngle(job: SchedulingModel) {
    const observer = Injector.get<IObservables<AngleSubscribe>>(
      INJECTOR_OBSERVABLES.ANGLE_JOB
    );
    const service = Injector.get<IBaseScheduleCase>(
      INJECTOR_CASES.SCHEDULE.INIT_ANGLE
    );

    observer.subscribe({
      pivot_id: job?.pivot_id,
      requiredAngle: job?.end_angle!,
      cb: () => service.sendJob({ job, is_stop: true }),
    });
  }

  sendJob: IBaseScheduleCase["sendJob"] = async ({ job }) => {
    try {
      await SchedulerSendAction.start({ job, is_stop: job?.is_stop || false });

      if (job?.is_stop) return;

      if (job?.is_return) {
        return this.finishByAngle(job);
      }

      return this.finishByDate(job);
    } catch (error) {
      console.warn("ERROR! .....");
      console.error(error.message);
    }
  };
}
