import { StateModel, StateVariableModel } from "../models";

export class CreateStateVariableDto {
  percentimeter: StateVariableModel["percentimeter"];
  angle?: StateVariableModel["angle"];
  state_id: StateModel["pivot_id"];
}
