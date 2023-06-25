import { getLastStateFull } from "./helpers/get-state";
import { checkPivotExist } from "../pivots/helpers";
import { checkUserExists } from "../users/helpers";

import { StateModel } from "@db/models";
import { CreateStateDto } from "@db/dto";
import { MutationStateVO } from "@db/value-objects";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { IAppLog, IBaseRepository, IBaseUseCases, IHashId } from "@root/domain";
import { Injector } from "@root/main/injector";

export class CreateStateUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  private checkLastStateEquals(oldState: StateModel, newState: CreateStateDto) {
    const powerEquals = oldState?.power === newState?.power;
    const waterEquals = oldState?.water === newState?.water;
    const directionEquals = oldState?.direction === newState?.direction;
    const connectionEquals = oldState?.connection === newState?.connection;

    return powerEquals && waterEquals && directionEquals && connectionEquals;
  }

  createEntity(state: CreateStateDto) {
    const vo = new MutationStateVO();
    return vo
      .create(Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH), state)
      .find();
  }

  execute = async (state: CreateStateDto) => {
    this.initInstances();

    await checkPivotExist(this.#baseRepo.findOne, state?.pivot_id);

    const lastState = await getLastStateFull(
      this.#baseRepo.findLast,
      state?.pivot_id
    );

    const statesEquals = this.checkLastStateEquals(lastState, state);

    if (statesEquals) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
        "Estado recebido coincide com antigo! Nada a alterar "
      );
      return;
    }

    const stateEntity = this.createEntity({ ...state });

    return await this.#baseRepo.create({
      column: DB_TABLES.STATES,
      data: stateEntity,
    });
  };
}
