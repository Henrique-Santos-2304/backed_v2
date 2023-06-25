import { Injector } from "@root/main/injector";
import { checkSchedulingExist } from "./helpers";
import { SchedulingModel } from "@root/infra/models";
import { IDelSchedulingHistExecute } from "@root/domain/usecases";

import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IObservables,
  IScheduler,
  ScheduleStub,
} from "@root/domain";

import {
  DB_TABLES,
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";

export class DeleteSchedulingUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #date: IAppDate;
  #managerScheduler: IScheduler;
  #observer: IObservables<ScheduleStub>;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#observer = Injector.get(INJECTOR_OBSERVABLES.SCHEDULE);

    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
    this.#managerScheduler = Injector.get(
      INJECTOR_CASES.COMMONS.SCHEDULE_MANAGER
    );
  }

  private async cbListener(scheduling_id: string, fail: boolean) {
    if (fail) {
      this.#console.warn("Ack não recebido ao deletar agendamento\n");
      return;
    }

    return await this.delSchedule(scheduling_id);
  }

  private async startBoardSchedule(scheduling: SchedulingModel) {
    this.#observer.subscribe({
      pivot_id: scheduling?.pivot_id,
      idp: IDPS.DEL_SCHEDULE,
      message: `#${IDPS.DEL_SCHEDULE}-${scheduling?.pivot_id}-${scheduling.start_date_of_module}$`,
      attempts: 1,
      cb: (fail: boolean) => this.cbListener(scheduling?.scheduling_id, fail),
    });
  }

  private async delSchedule(schedule_id: string) {
    await this.#baseRepo.delete({
      column: DB_TABLES.SCHEDULINGS,
      where: "scheduling_id",
      equals: schedule_id,
    });
  }

  execute: IDelSchedulingHistExecute = async ({ scheduling_id }) => {
    this.initInstances();

    const scheduling = await checkSchedulingExist(
      this.#baseRepo.findOne,
      scheduling_id
    );

    const running = this.#date.dateIsAter(
      new Date(),
      scheduling?.is_stop
        ? scheduling?.end_timestamp!
        : scheduling?.start_timestamp!
    );

    if (running) {
      return "Agendamento em execução".toUpperCase();
    }

    if (!scheduling?.is_board) {
      this.#managerScheduler.stop(
        `${scheduling?.pivot_id}-${scheduling?.scheduling_id}-${
          scheduling?.is_stop ? "end" : "start"
        }`
      );
      return await this.delSchedule(scheduling_id);
    }

    await this.startBoardSchedule(scheduling);
  };
}
