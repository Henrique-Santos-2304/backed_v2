import { StateModel } from "@root/infra/models";
import { IBaseUseCases, IIsGateway } from "../bases";

type ValueVariables = {
  value: number;
  timestamp: Date | string;
  state_id: string;
};

type OmitterState = Omit<StateModel, "state_id" | "pivot_id" | "timestamp"> & {
  timestamp: string;
};
export type PartialCycleResponse = {
  start_date: string;
  end_date: string;
  is_running: boolean;
  start_state: Pick<
    StateModel,
    "power" | "water" | "start_angle" | "direction"
  >;
  states: OmitterState[];
  percentimeters: Array<ValueVariables>;
  angles: Array<ValueVariables>;
};

export type IGetStateHistoryExec = IBaseUseCases<
  { pivot_id: string; start_date: string; end_date: string },
  PartialCycleResponse[]
>["execute"];

export type ActionProps = {
  pivot_id: string;
  direction: StateModel["direction"];
  power: boolean;
  water: boolean;
  percentimeter: boolean;
  author: string;
};

export type ICreateActionExecute = IBaseUseCases<
  { action: string } & IIsGateway,
  void
>["execute"];
