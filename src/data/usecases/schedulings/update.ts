import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
  IScheduler,
  ScheduleStub,
} from "@root/domain";
import { IPutSchedulingHistExecute } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";
import {
  DB_TABLES,
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";
import { checkSchedulingExist } from "./helpers";
import { SchedulingModel } from "@root/infra/models";
import { MutationScheduleHistVO } from "@root/infra";
import { SchedulerSendAction } from "./helpers/send-action";

export class UpdateSchedulingUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #date: IAppDate;
  #iot: IIotConnect;
  #managerScheduler: IScheduler;
  #observer: IObservables<ScheduleStub>;
  #createSchedule: IBaseUseCases;

  private initInstances() {
    this.#baseRepo = this.#baseRepo || Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console || Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#observer =
      this.#observer || Injector.get(INJECTOR_OBSERVABLES.SCHEDULE);

    this.#date = this.#date || Injector.get(INJECTOR_COMMONS.APP_DATE);
    this.#iot = this.#iot || Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#managerScheduler =
      this.#managerScheduler ||
      Injector.get(INJECTOR_CASES.COMMONS.SCHEDULE_MANAGER);
  }

  private getIdp(newData: SchedulingModel) {
    return newData?.is_return
      ? IDPS.SCHEDULING_FULL_ANGLE
      : newData?.is_stop
      ? IDPS.SCHEDULING_STOP_DATE
      : IDPS.SCHEDULING_FULL_DATE;
  }

  private handlerTypeSchedule(type: SchedulingModel["type"]) {
    if (type === "FULL_ANGLE") return "angle-complete";
    else if (type === "STOP_ANGLE") return "angle-stop";
    else if (type === "FULL_DATE") return "date-complete";
    else return "date-stop";
  }

  private async cbListener(scheduling: SchedulingModel, fail: boolean) {
    if (fail) {
      this.#console.warn(
        "Ack não recebido ao deletar em  (ATUALIZAÇÃO) agendamento\n"
      );
      return;
    }

    await this.#baseRepo.delete({
      column: DB_TABLES.SCHEDULINGS,
      where: "scheduling_id",
      equals: scheduling?.scheduling_id,
    });

    return await this.#createSchedule.execute({
      ...scheduling,
      type: this.handlerTypeSchedule(scheduling?.type),
    });
  }

  private async startLocalSchedule(scheduling: SchedulingModel) {
    await this.#baseRepo.update({
      column: DB_TABLES.SCHEDULINGS,
      where: "scheduling_id",
      equals: scheduling?.scheduling_id,
      data: scheduling,
    });

    this.#managerScheduler.stop(
      `${scheduling?.pivot_id}-${scheduling?.scheduling_id}-${
        scheduling?.is_stop ? "end" : "start"
      }`
    );

    SchedulerSendAction.handleAndInitSchedule(scheduling);
  }

  private async startBoardSchedule(scheduling: SchedulingModel) {
    this.#observer.subscribe({
      pivot_id: scheduling?.pivot_id,
      idp: IDPS.DEL_SCHEDULE,
      message: `#${IDPS.DEL_SCHEDULE}-${scheduling?.pivot_id}-${scheduling.start_date_of_module}$`,
      attempts: 1,
      cb: (fail: boolean) => this.cbListener(scheduling, fail),
    });
  }

  private createEntity(oldData: SchedulingModel, newData: SchedulingModel) {
    const vo = new MutationScheduleHistVO();
    const idp = this.getIdp(newData);

    return vo.update(idp, oldData, newData).find();
  }

  execute: IPutSchedulingHistExecute = async ({ schedule }) => {
    this.initInstances();

    const scheduling = await checkSchedulingExist(
      this.#baseRepo.findOne,
      schedule?.scheduling_id
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

    const entity = this.createEntity(scheduling, schedule);

    if (!scheduling?.is_board) {
      await this.startLocalSchedule(entity);
      return entity;
    }

    await this.startBoardSchedule(scheduling);

    return entity;
  };
}
