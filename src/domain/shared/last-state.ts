import { StateModel, StateVariableModel, PivotModel } from "@root/infra/models";

export type ReturnLastStateProps = Pick<
  StateModel,
  "connection" | "direction" | "power" | "water"
> &
  Pick<StateVariableModel, "percentimeter" | "angle"> & {
    last_timestamp: string;
  };
