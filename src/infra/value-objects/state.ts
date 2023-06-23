import { StateModel } from "../models";
import { IHashId } from "@contracts/index";
import { CreateStateDto } from "../dto/state";

export class MutationStateVO {
  #state: StateModel;

  constructor() {
    this.#state = new StateModel();
  }

  create(uuidGenerator: IHashId, state: CreateStateDto) {
    this.#state.state_id = uuidGenerator.generate();
    this.#state = { ...this.#state, ...state };
    this.#state.timestamp = new Date();
    this.#state.connection = state.connection || true;

    return this;
  }

  find = () => this.#state;
}
