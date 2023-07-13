import { StateModel } from "../models";
import { IHashId } from "@contracts/index";
import { CreateStateDto } from "../dto/state";

export class MutationStateVO {
  #state: StateModel;

  constructor() {
    this.#state = new StateModel();
  }

  create(uuidGenerator: IHashId, state: CreateStateDto) {
    this.#state.id = uuidGenerator.generate();
    this.#state = { ...this.#state, ...state };
    this.#state.start_date = new Date();
    this.#state.timestamp = new Date();

    return this;
  }

  find = () => this.#state;
}
