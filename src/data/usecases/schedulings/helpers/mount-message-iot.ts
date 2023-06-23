import { IAppDate } from "@root/domain";
import { RequestScheduleCreate } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";
import { IDPS, INJECTOR_COMMONS } from "@root/shared";

const mountIdp = (scheduling: RequestScheduleCreate) => {
  if (
    scheduling?.type === "angle-stop" ||
    scheduling?.type === "angle-complete"
  ) {
    return {
      idp: scheduling?.is_return
        ? IDPS.SCHEDULING_FULL_ANGLE
        : IDPS.SCHEDULING_STOP_ANGLE,
      angleOrDate: scheduling?.end_angle || 0,
    };
  }

  return {
    idp:
      scheduling?.type === "date-stop"
        ? IDPS.SCHEDULING_STOP_DATE
        : IDPS.SCHEDULING_FULL_DATE,
    angleOrDate: Injector.get<IAppDate>(INJECTOR_COMMONS.APP_DATE).catchDiff(
      scheduling?.end_timestamp!
    ),
  };
};

export const mountMessageSchedule = async (
  scheduling: RequestScheduleCreate
) => {
  const { idp, angleOrDate } = mountIdp(scheduling);

  const startDate = Injector.get<IAppDate>(INJECTOR_COMMONS.APP_DATE).catchDiff(
    scheduling?.start_timestamp!
  );

  const direction = scheduling?.direction === "ANTI_CLOCKWISE" ? 4 : 3;
  const water = scheduling?.water ? 6 : 5;
  const power = scheduling?.power ? 1 : 2;
  const percent = scheduling?.percentimeter ?? 0;

  if (scheduling?.type === "date-stop" || scheduling?.type === "angle-stop") {
    const dateAngle =
      scheduling?.type === "angle-stop"
        ? angleOrDate.toString().padStart(3, "0")
        : angleOrDate;

    return {
      msg: `#${idp}-${dateAngle}$`,
      idp,
    };
  }

  const dateAngle =
    scheduling?.type === "angle-complete"
      ? angleOrDate.toString().padStart(3, "0")
      : angleOrDate;

  return {
    msg: `#${idp}-${startDate}-${dateAngle}-${direction}${water}${power}-${percent
      .toString()
      .padStart(3, "0")}$`,
    idp,
  };
};
