import { getLastStateFull } from "./helpers/get-state";
import { checkPivotExist } from "../pivots/helpers";
import { checkUserExists } from "../users/helpers";

import { StateModel } from "@db/models";
import { CreateStateDto } from "@db/dto";
import { MutationStateVO } from "@db/value-objects";

import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IHashId,
  SendMessageSignalType,
} from "@root/domain";
import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";

export class CreateStateUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #sendMessageSignal: IBaseUseCases<SendMessageSignalType>;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#sendMessageSignal = Injector.get(
      INJECTOR_CASES.COMMONS.SEND_MESSAGES_SIGNAL
    );
  }

  private checkLastStateEquals(oldState: StateModel, newState: CreateStateDto) {
    const powerEquals = oldState?.power === newState?.power;
    const waterEquals = oldState?.water === newState?.water;
    const directionEquals = oldState?.direction === newState?.direction;
    const connectionEquals = oldState?.connection === newState?.connection;

    return powerEquals && waterEquals && directionEquals && connectionEquals;
  }

  private async sendMessageSignal(
    farm_id: string,
    oldState: StateModel,
    newState: CreateStateDto
  ) {
    const powerEquals = oldState?.power === newState.power;
    const connectionEquals = oldState?.connection === newState.connection;

    if (powerEquals && connectionEquals) return;
    const farm = await checkFarmExist(farm_id);

    await this.#sendMessageSignal.execute({
      farm_name: farm?.farm_name,
      users: [farm?.user_id, farm?.dealer!, ...farm.users!],
      state: newState,
    });
  }

  createEntity(state: CreateStateDto) {
    const vo = new MutationStateVO();
    return vo
      .create(Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH), state)
      .find();
  }

  execute = async (state: CreateStateDto) => {
    this.initInstances();

    const piv = await checkPivotExist(state?.pivot_id);

    const lastState = await getLastStateFull(state?.pivot_id);

    const statesEquals = this.checkLastStateEquals(lastState, state);

    if (statesEquals) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
        "Estado recebido coincide com antigo! Nada a alterar "
      );
      return;
    }

    const stateEntity = this.createEntity({ ...state });

    await this.sendMessageSignal(piv?.farm_id, lastState, state);

    return await this.#baseRepo.create(DB_TABLES.STATES, stateEntity);
  };
}
