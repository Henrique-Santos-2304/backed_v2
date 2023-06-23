import { StateModel, StateVariableModel } from "../models";
import { IHashId } from "@root/domain";
import { CreateStateVariableDto } from "../dto/state_variables";

export class MutationStateVariableVO {
  #state: StateVariableModel;

  constructor() {
    this.#state = new StateVariableModel();
  }

  create(uuidGenerator: IHashId, state: CreateStateVariableDto) {
    this.#state.state_id = uuidGenerator.generate();
    this.#state = { ...this.#state, ...state };
    this.#state.timestamp = new Date();

    return this;
  }

  find = () => this.#state;
}
