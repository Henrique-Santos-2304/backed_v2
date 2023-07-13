import { IHashId } from "@contracts/index";
import { CreateConnectionDto, CreateCycleDto } from "../dto";
import { ConnectionModel } from "../models";

export class MutationConnectionVO {
  #connection: ConnectionModel;

  constructor() {
    this.#connection = new ConnectionModel();
  }

  create(uuidGenerator: IHashId, state: CreateConnectionDto) {
    this.#connection.id = uuidGenerator.generate();
    this.#connection = { ...this.#connection, ...state };
    this.#connection.loss_date = new Date();
    this.#connection.timestamp = new Date();

    return this;
  }

  find = () => this.#connection;
}
