import { StateModel } from "../models";
import { IHashId } from "@contracts/index";
import { CreateStateDto } from "../dto/state";
import { splitMsgCloud } from "@root/shared";

export class MutationStateVO {
  #state: StateModel;

  constructor() {
    this.#state = new StateModel();
  }

  create(uuidGenerator: IHashId, state: CreateStateDto) {
    const { toList } = splitMsgCloud(state?.status);
    this.#state.id = uuidGenerator.generate();
    this.#state = { ...this.#state, ...state };
    (this.#state.is_off = false),
      (this.#state.start_variable = `#${toList[3]}-${toList[4]}$`);
    this.#state.start_date = new Date();
    this.#state.timestamp = new Date();

    return this;
  }

  find = () => this.#state;
}
