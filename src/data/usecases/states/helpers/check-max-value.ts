import { IAppLog } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

export const checkMinMaxPercent = (value: string) => {
  try {
    const percent = Number(value);

    if (percent > 100) return 100;
    else if (percent < 0) return 0;
    return percent;
  } catch (error) {
    const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
    console.warn("Erro ao checar valor minimo e máximo de percentímetro...");
    console.error(error.message);
  }
};

export const checkMinMaxAngle = (value: string) => {
  try {
    const angle = Number(value);

    if (angle > 360) return 360;
    else if (angle < 0) return 0;
    return angle;
  } catch (error) {
    const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
    console.warn("Erro ao checar valor minimo e máximo de ângulo...");
    console.error(error.message);
  }
};
