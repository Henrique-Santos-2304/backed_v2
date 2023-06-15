import { IAppDate } from "@root/domain";

export class AppLogs {
  constructor(private appDate: IAppDate) {}

  log(message: string) {
    console.log(
      `\x1b[96m_${this.appDate.dateSpString()}:\x1b[0m  \x1b[32m${message}\x1b[0m`
    );
  }

  error(message: string) {
    console.error(
      `\x1b[96m_${this.appDate.dateSpString()}:\x1b[0m \x1b[31m${message}\x1b[0m`
    );
  }

  warn(message: string) {
    console.warn(
      `\x1b[96m_${this.appDate.dateSpString()}:\x1b[0m \x1b[93m${message}\x1b[0m`
    );
  }
}
