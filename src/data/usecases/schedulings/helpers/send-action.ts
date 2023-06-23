import { SchedulingModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IScheduler,
} from "@root/domain";

import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";

type SchedSendActionProps = {
  job: SchedulingModel;
  is_stop: boolean;
};
export class SchedulerSendAction {
  static getDepencies() {
    const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
    const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);

    const initByAngle = Injector.get(INJECTOR_CASES.SCHEDULE.INIT_ANGLE);

    const initByDate = Injector.get(INJECTOR_CASES.SCHEDULE.INIT_DATE);

    const managerSchedule = Injector.get(
      INJECTOR_CASES.COMMONS.SCHEDULE_MANAGER
    );

    const createAction = Injector.get<IBaseUseCases>(
      INJECTOR_CASES.STATES.ACTION
    );

    return {
      baseRepo,
      createAction,
      console,
      initByAngle,
      initByDate,
      managerSchedule,
    };
  }

  static handleAndInitSchedule(job: SchedulingModel) {
    const { initByAngle, initByDate, managerSchedule } =
      SchedulerSendAction.getDepencies();

    const typeIstop = job?.type === "STOP_ANGLE" || job?.type === "STOP_DATE";

    const id = `${job?.pivot_id}-${job?.scheduling_id}-${
      typeIstop ? "end" : "start"
    }`;

    const date = job?.is_stop
      ? job?.end_timestamp!
      : job?.type === "STOP_ANGLE"
      ? new Date(Date.now() + 2000)
      : job?.start_timestamp!;

    managerSchedule.start({
      id,
      date,
      cb: job?.type === "STOP_ANGLE" ? initByAngle.sendJob : initByDate.sendJob,
      dataBind: job?.type === "STOP_ANGLE" ? { job, is_stop: true } : { job },
    });
  }

  static async start({ job, is_stop = false }: SchedSendActionProps) {
    try {
      const { baseRepo, createAction, console } =
        SchedulerSendAction.getDepencies();

      console.log(
        `${is_stop ? "Finalizando" : "Iniciando"} agendamento do tipo ${
          job?.type
        } no pivô ${job.pivot_id}`
      );

      await createAction.execute({
        pivot_id: job.pivot_id,
        author: job.author,
        power: job.is_stop ? false : job?.power || false,
        water: job.is_stop ? false : job?.water || false,
        direction: job.is_stop ? "CLOCKWISE" : job?.direction || "CLOCKWISE",
        percentimeter: job.is_stop ? 0 : job?.percentimeter || 0,
      });

      await baseRepo.update<Partial<SchedulingModel>>({
        column: DB_TABLES.SCHEDULINGS,
        where: "scheduling_id",
        equals: job?.scheduling_id,
        data: { status: is_stop ? "FINISHED" : "RUNNING" },
      });

      const scheduler = Injector.get<IScheduler>(
        INJECTOR_COMMONS.APP_ENCRYPTER
      );

      scheduler.stop(
        `${job?.pivot_id}-${job?.scheduling_id}-${is_stop ? "end" : "start"}`
      );
    } catch (error) {
      const { console } = SchedulerSendAction.getDepencies();
      console.warn(
        `Erro ao executar ação do agendamento para o pivo ${job?.pivot_id}`
      );
      console.error(error.message);
    }
  }
}
