import { SchedulingModel } from "@root/infra/models";
import { IBaseUseCases, IIsGateway } from "../bases";

export type RequestScheduleCreate = Omit<
  SchedulingModel,
  "scheduling_id" | "type"
> & {
  type: "date-stop" | "date-complete" | "angle-stop" | "angle-complete";
};

export type ISaveSchedule = {
  schedule: string[];
  is_board: boolean;
  author?: string;
} & IIsGateway;

export type ICreateSchedulingHistExecute = IBaseUseCases<
  ISaveSchedule,
  SchedulingModel
>["execute"];

export type IPutSchedulingHistExecute = IBaseUseCases<
  { schedule: SchedulingModel },
  SchedulingModel | string
>["execute"];

export type IDelSchedulingHistExecute = IBaseUseCases<
  { scheduling_id: string },
  void | string
>["execute"];
