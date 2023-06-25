import schedule from "node-schedule";
import { IAppDate, IAppLog, IScheduler, InitScheduleType } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

export class ScheduleManager implements IScheduler {
  #console: IAppLog;
  #scheduler: any;
  #date: IAppDate;

  private initInstances() {
    this.#scheduler = this.#scheduler || schedule;
    this.#date = this.#date || Injector.get(INJECTOR_COMMONS.APP_DATE);

    this.#console =
      this.#console || Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
  }

  stop(id: string): void {
    try {
      this.initInstances();
      schedule.cancelJob(id);
    } catch (error) {
      this.#console.warn("Erro ao parar agendamento");
      this.#console.error(error.message);
    }
  }

  start({ id, date, cb, dataBind }: InitScheduleType) {
    try {
      this.initInstances();

      this.#console.log(`Configurando novo agendamento ${id}`);
      const start = this.#date.addDiffSecond(date);
      const secondEnd = date + 1;
      const end = this.#date.addDiffSecond(secondEnd);

      schedule.scheduleJob(
        id,
        { start, end, rule: "* * * * * *" },
        cb.bind(null, dataBind)
      );
    } catch (error) {
      this.#console.warn("Erro ao iniciar agendamento");
      this.#console.error(error.message);
    }
  }
}
