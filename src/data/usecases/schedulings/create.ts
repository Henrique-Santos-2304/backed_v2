import { mountMessageSchedule } from "./helpers/mount-message-iot";
import { RequestScheduleCreate } from "@root/domain/usecases";
import { checkPivotExist } from "../pivots/helpers";
import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
  ScheduleStub,
} from "@root/domain";
import { Injector } from "@root/main/injector";
import {
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";

class CreateSchedulingUseCase implements IBaseUseCases {
  #date: IAppDate;
  #iot: IIotConnect;
  #observer: IObservables<ScheduleStub>;
  #console: IAppLog;
  #saveSchedule: IBaseUseCases;
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#date =
      this.#date || Injector.get<IAppDate>(INJECTOR_COMMONS.APP_DATE);

    this.#iot = this.#iot || Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#observer =
      this.#observer || Injector.get(INJECTOR_OBSERVABLES.SCHEDULE);

    this.#console = this.#console || Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#saveSchedule =
      this.#saveSchedule || Injector.get(INJECTOR_CASES.SCHEDULE.SAVE);

    this.#baseRepo = this.#baseRepo || Injector.get(INJECTOR_REPOS.BASE);
  }

  private async cbListener(
    message: string,
    scheduling: RequestScheduleCreate,
    fail: boolean,
    board_msg?: string[]
  ) {
    this.#console.warn(
      fail
        ? "Ack não recebido ao criar agendamento, criando manualmente...."
        : "Ack recebido de agendamento"
    );

    const listMyMsg = message.split("#")[1].split("$")[0].split("-");

    const board_id = !board_msg ? "manual" : board_msg[2];

    const payload = [
      listMyMsg[0],
      scheduling?.pivot_id,
      board_id,
      ...listMyMsg.splice(1),
    ];

    await this.#saveSchedule.execute({
      schedule: payload,
      is_board: !fail,
      author: scheduling?.author,
    });
  }

  private async listenerSchedule(scheduling: RequestScheduleCreate) {
    const { msg, idp } = await mountMessageSchedule(scheduling);

    this.#observer.subscribe({
      pivot_id: scheduling?.pivot_id,
      idp,
      message: msg,
      attempts: 1,
      cb: (fail: boolean, message?: string[]) =>
        this.cbListener(msg, scheduling, fail, message),
    });
  }

  async execute(scheduling: RequestScheduleCreate) {
    this.initInstances();

    const piv = await checkPivotExist(
      this.#baseRepo.findOne,
      scheduling?.pivot_id
    );

    if (!piv?.is_gprs) {
      return await this.#iot.publisher(
        `${piv?.farm_id}_0`,
        JSON.stringify(scheduling)
      );
    }

    this.#console.log(
      `Novo agendamento do tipo ${scheduling?.type} para o pivô ${scheduling?.pivot_id}`
    );

    await this.listenerSchedule(scheduling);
  }
}

export { CreateSchedulingUseCase };
