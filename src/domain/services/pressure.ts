import { StateModel, StateVariableModel } from "@root/infra/models";

export type PivotPressureType = {
  pivot_id: string;
  attempts: number;
  received_message: boolean;
  timer: NodeJS.Timer;
};

export type StateReceivedType = Pick<
  StateModel,
  "direction" | "water" | "power"
> &
  Pick<StateVariableModel, "percentimeter" | "angle">;
