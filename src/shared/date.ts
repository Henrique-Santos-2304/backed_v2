import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import CustomParserPlugin from "dayjs/plugin/customParseFormat";
import { IAppDate } from "@root/domain";

export class AppDate implements IAppDate {
  #instance: typeof dayjs;
  #format: string = "DD/MM/YYYY HH:mm:ss";
  #timezone: string = "America/Sao_Paulo";

  constructor() {
    this.config();
  }

  private config() {
    dayjs.extend(utc);
    dayjs.extend(CustomParserPlugin);
    dayjs.extend(timezone);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);
    dayjs.tz.setDefault(this.#timezone);

    this.#instance = dayjs;
  }

  toDateSP(date: Date) {
    return this.#instance(date).tz(this.#timezone).toDate();
  }

  dateSpString() {
    return this.#instance().format(this.#format);
  }
}
