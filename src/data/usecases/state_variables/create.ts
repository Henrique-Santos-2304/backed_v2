import { getLastStateVariable } from "./helpers/get-state";

import { StateVariableModel } from "@db/models";
import { CreateStateVariableDto } from "@db/dto";
import { MutationStateVariableVO } from "@db/value-objects";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { IAppLog, IBaseRepository, IBaseUseCases, IHashId } from "@root/domain";
import { Injector } from "@root/main/injector";

export class CreateStateVariableUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  private checkValues(old: number, newNum: number) {
    const subtract = old - newNum;

    return (
      subtract === 0 ||
      (subtract > 0 && subtract < 5) ||
      (subtract < 0 && subtract > -5)
    );
  }

  private checkLastStateEquals(
    oldState: StateVariableModel,
    newState: CreateStateVariableDto
  ) {
    const percentNotValid = this.checkValues(
      oldState?.percentimeter,
      newState?.percentimeter
    );
    const angleNotValid = this.checkValues(oldState?.angle, newState?.angle!);

    return percentNotValid && angleNotValid;
  }

  createEntity(state: CreateStateVariableDto) {
    const vo = new MutationStateVariableVO();
    return vo
      .create(Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH), state)
      .find();
  }

  execute = async (variable: CreateStateVariableDto) => {
    this.initInstances();

    const lastState = await getLastStateVariable(variable?.state_id);

    const statesEquals =
      lastState && this.checkLastStateEquals(lastState, variable);

    if (lastState && statesEquals) {
      this.#console.warn(
        "Variáveis recebidas coincidem com antigo! Nada a alterar \n"
      );
      return;
    }

    const stateEntity = this.createEntity({ ...variable });

    return await this.#baseRepo.create<StateVariableModel>(
      DB_TABLES.STATE_VARIABLES,
      stateEntity
    );
  };
}
