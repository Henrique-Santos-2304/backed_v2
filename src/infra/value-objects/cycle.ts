import { IHashId } from "@contracts/index";
import { CycleModel } from "../models/cycle";
import { CreateCycleDto } from "../dto";

export class MutationCycleVO {
  #cycle: CycleModel;

  constructor() {
    this.#cycle = new CycleModel();
  }

  create(uuidGenerator: IHashId, state: CreateCycleDto) {
    this.#cycle.id = uuidGenerator.generate();
    this.#cycle = { ...this.#cycle, ...state };
    this.#cycle.timestamp = new Date();

    return this;
  }

  find = () => this.#cycle;
}
