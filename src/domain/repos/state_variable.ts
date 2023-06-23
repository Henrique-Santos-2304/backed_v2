import { StateVariableModel } from "@root/infra/models";

export type GetVariableGroupByResponse = Pick<
  StateVariableModel,
  "percentimeter" | "angle" | "timestamp"
>;
export interface IStateVariableRepo {
  getVariableGroupBy(state_id: string): Promise<GetVariableGroupByResponse[]>;
}
