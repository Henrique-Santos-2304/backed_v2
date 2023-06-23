import { PivotModel } from "@root/infra/models";

export type GetLastStatePivot = Pick<
  PivotModel,
  "last_angle" | "last_timestamp" | "last_state"
>;
export interface IPivotRepo {
  getLastState(pivot_id: string): Promise<GetLastStatePivot>;
}
