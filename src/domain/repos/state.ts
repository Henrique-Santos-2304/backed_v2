import { StateModel } from "@root/infra/models";

export interface IStateRepo {
  getHistoryCycle(
    pivot_id: string,
    start: Date,
    end: Date
  ): Promise<StateModel[]>;
}
