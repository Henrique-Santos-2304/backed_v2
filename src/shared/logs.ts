import { IAppDate, IAppLog } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "./constants";

export class AppLogs implements IAppLog {
  log(message: any) {
    console.log(
      `\x1b[96m_${Injector.get<IAppDate>(
        INJECTOR_COMMONS.APP_DATE
      ).dateSpString()}:\x1b[0m  \x1b[32m${message}\x1b[0m`
    );
  }

  error(message: any) {
    console.error(
      `\x1b[96m_${Injector.get<IAppDate>(
        INJECTOR_COMMONS.APP_DATE
      ).dateSpString()}:\x1b[0m \x1b[31m${message}\x1b[0m`
    );
  }

  warn(message: any) {
    console.warn(
      `\x1b[96m_${Injector.get<IAppDate>(
        INJECTOR_COMMONS.APP_DATE
      ).dateSpString()}:\x1b[0m \x1b[93m${message}\x1b[0m`
    );
  }
}
