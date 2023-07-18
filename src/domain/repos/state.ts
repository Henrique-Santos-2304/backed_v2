import { CycleModel, StateModel, StateVariableModel } from "@root/infra/models";

export type CycleResponseType = StateModel & {
  cycles: CycleModel[];
  variables: StateVariableModel[];
};
export interface IStateRepo {
  getCycles(
    pivot_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<CycleResponseType[]>;
}
