import schedule, { RecurrenceRule } from "node-schedule";
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

  private transformRule(date: Date | string): RecurrenceRule {
    const dateLocal = this.#date.detailsData(date);

    const rule = new schedule.RecurrenceRule();
    rule.date = dateLocal.date;
    rule.month = dateLocal.month;
    rule.year = dateLocal.year;
    rule.hour = dateLocal.hour;
    rule.minute = dateLocal.minute;
    rule.second = dateLocal.second;

    return rule;
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
      schedule.scheduleJob(
        id,
        this.transformRule(date),
        cb.bind(null, dataBind)
      );
    } catch (error) {
      this.#console.warn("Erro ao iniciar agendamento");
      this.#console.error(error.message);
    }
  }
}
