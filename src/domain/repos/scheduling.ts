import { SchedulingModel, StateModel } from "@root/infra/models";

export interface ISchedulingRepo {
  angles(pivot_id: string): Promise<SchedulingModel[]>;
  dates(pivot_id: string): Promise<SchedulingModel[]>;
}
