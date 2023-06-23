import { StateModel } from "../models";

export class CreateStateDto {
  power: StateModel["power"];
  connection?: boolean;
  water: StateModel["water"];
  direction: StateModel["direction"];
  pivot_id: StateModel["pivot_id"];
  author?: StateModel["author"];
}
