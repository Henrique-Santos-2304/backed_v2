import { IAppDate, ReturnLastStateProps } from "@root/domain";
import { IPivotRepo } from "@root/domain/repos";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

export const getLastStateString = async (
  repo: IPivotRepo["getLastState"],
  pivot_id: string
) => {
  const state = await repo(pivot_id);
  return state?.last_state;
};

export const getLastState = async (
  pivot: PivotModel
): Promise<ReturnLastStateProps> => {
  const date = Injector.get<IAppDate>(INJECTOR_COMMONS.APP_DATE);
  if (!pivot?.last_state || pivot?.last_state === "000-000") {
    return {
      direction: "CLOCKWISE",
      water: false,
      power: false,
      percentimeter: 0,
      angle: 0,
      connection: false,
      last_timestamp: date.toDateSpString(pivot?.last_timestamp || new Date()),
    };
  }

  const [base, percent, angle, timestamp] = pivot?.last_state?.split("-");

  return {
    direction: base[0] === "3" ? "CLOCKWISE" : "ANTI_CLOCKWISE",
    water: base[1] === "6",
    power: base[2] === "1",
    percentimeter: Number(percent),
    connection: true,
    angle: Number(angle),
    last_timestamp: date.toDateSpString(pivot?.last_timestamp || timestamp),
  };
};
