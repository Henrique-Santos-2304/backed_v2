import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import CustomParserPlugin from "dayjs/plugin/customParseFormat";
import AdvancedFormat from "dayjs/plugin/advancedFormat";

import { GetDetailData, IAppDate } from "@root/domain";

export class AppDate implements IAppDate {
  #instance: typeof dayjs;
  #format: string = "DD/MM/YYYY HH:mm:ss";
  #timezone: string = "America/Sao_Paulo";

  constructor() {
    this.config();
  }

  private config() {
    dayjs.extend(AdvancedFormat);
    dayjs.extend(utc);
    dayjs.extend(CustomParserPlugin);
    dayjs.extend(timezone);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);
    dayjs.tz.setDefault(this.#timezone);

    this.#instance = dayjs;
  }

  handleDateToHistories(date: string, hour: number) {
    const [day, month, year] = date.split("-");
    const ha = this.#instance(`${year}-${month}-${day}`)
      .tz("America/Sao_Paulo")
      .second(0)
      .hour(hour)
      .minute(0)
      .subtract(3, "hour");
    return ha.toDate();
  }

  toDateSP(date: Date) {
    return this.#instance(date).tz(this.#timezone).toDate();
  }

  dateSpString() {
    const dateString = this.#instance().format(this.#format);
    return dateString;
  }

  dateNow() {
    return this.#instance().toDate();
  }

  toDateSpString(date: Date) {
    const dateString = this.#instance(date)
      .tz(this.#timezone)
      .format(this.#format);
    return dateString;
  }

  catchDiff(date: Date | null) {
    const diff = this.#instance(date).diff();
    return Math.round(Math.abs(diff) / 1000);
  }

  dateIsAter(dateOne?: Date, dateTwo?: Date) {
    const dateFirst = dateOne ? this.#instance(dateOne) : this.#instance();
    const dateReceived = dateTwo ? this.#instance(dateTwo) : this.#instance();
    const dateIsAfter = dateFirst.isSameOrAfter(dateReceived);

    return dateIsAfter;
  }

  detailsData(date: string | Date): GetDetailData {
    const dateLocal = this.#instance(date).tz(this.#timezone);
    return {
      date: dateLocal.date(),
      month: dateLocal.month(),
      year: dateLocal.year(),
      hour: dateLocal.add(3, "hour").hour(),
      minute: dateLocal.minute(),
      second: dateLocal.second(),
    };
  }

  addDiffSecond(second: number): Date {
    return this.#instance().add(second, "seconds").toDate();
  }
}
