import { getLastStateFull } from "./helpers/get-state";
import { checkPivotExist } from "../pivots/helpers";
import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";

import { CycleModel, StateModel } from "@db/models";
import { CreateStateDto } from "@db/dto";
import { MutationCycleVO, MutationStateVO } from "@db/value-objects";

import {
  DB_TABLES,
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
  splitMsgCloud,
} from "@root/shared";
import {
  IAppDate,
  IBaseRepository,
  IBaseUseCases,
  IHashId,
  SendMessageSignalType,
} from "@root/domain";

export class CreateStateUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #date: IAppDate;
  #sendMessageSignal: IBaseUseCases<SendMessageSignalType>;
  #oldState: string[];
  #newState: string[];

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#sendMessageSignal = Injector.get(
      INJECTOR_CASES.COMMONS.SEND_MESSAGES_SIGNAL
    );
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  private async getLastState(id: string) {
    const lastState = await getLastStateFull(id);

    if (!lastState) return;

    const { toList } = splitMsgCloud(lastState?.status);
    this.#oldState = toList;
    return lastState;
  }

  private async sendMessageSignal(farm_id: string, newState: CreateStateDto) {
    const powerEquals =
      this.#oldState && this.#oldState[2] === this.#newState[2][2];

    if (powerEquals) return;
    const farm = await checkFarmExist(farm_id);

    await this.#sendMessageSignal.execute({
      farm_name: farm?.name,
      users: [farm?.owner, farm?.dealer!, ...farm.workers!],
      state: newState,
    });
  }

  private twicePowersEquals() {
    return this.#oldState[2][2] === this.#newState[2][2];
  }

  private twiceStatesIsOff() {
    return this.#oldState[2][2] === "2" && this.twicePowersEquals();
  }

  private async createNewState(farm_id: string, author?: string) {
    this.#newState[7] = author || "manual";
    this.#newState[6] = this.#date.dateSpString();
    const beforePercent = this.#newState.slice(0, 4).join("-");
    const afterPercent = this.#newState.slice(4).join("-");
    const status = `#${beforePercent}-${this.#newState[3]}-${afterPercent}$`;

    const stateEntity = new MutationStateVO()
      .create(Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH), {
        pivot_id: this.#newState[1],
        status,
      })
      .find();

    await this.sendMessageSignal(farm_id, {
      pivot_id: this.#newState[1],
      status,
    });

    const states = await this.#baseRepo.create(DB_TABLES.STATES, stateEntity);
    return states;
  }

  /**
   * The function creates a new cycle, logs the entity, creates the cycle in the database, logs the created cycle, sends a
   * message signal, and returns the created cycle.
   * @param {string} farm_id - The `farm_id` parameter is a string that represents the ID of a farm.
   * @param {string} id - The `id` parameter in the `createCycle` function is a string that represents the state ID.
   * @returns the `cycle` object.
   */
  private async createCycle(farm_id: string, id: string) {
    const entity = new MutationCycleVO()
      .create(Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH), {
        state_id: id,
        status: `#${this.#newState.join("-")}-running$`,
      })
      .find();

    await this.sendMessageSignal(farm_id, {
      pivot_id: this.#newState[1],
      status: `#${this.#newState.join("-")}$`,
    });

    return await this.#baseRepo.create("cycle", entity);
  }

  /**
   * The function checks if the payload is a valid message and assigns it to the newState property.
   * @param {string[]} payload - The `payload` parameter is an array of strings.
   */
  private messageIsValid(payload: string[]) {
    if (payload?.length !== 7) {
      throw new Error("Padrão de mensagem inválido");
    }

    this.#newState = payload;
  }

  /**
   * The function handles the state difference by updating the old state, creating a new state if it was turned off, and
   * updating the database with the new state information.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the state. It is used to
   * identify the specific state that needs to be updated in the database.
   * @param {string} farm_id - The `farm_id` parameter is a string that represents the ID of a farm.
   * @param {string} [author] - The `author` parameter is an optional string that represents the author of the state diff.
   * If it is provided, it will be assigned to the `this.#oldState[6]` property. If it is not provided, the value "manual"
   * will be assigned to `this.#oldState
   * @returns the result of the `update` method call on `this.#baseRepo`.
   */
  private async handleStateDiff(id: string, farm_id: string, author?: string) {
    const itWasTurnedOff = this.#oldState[2][2] === "2";
    this.#oldState[6] = author || "manual";

    if (itWasTurnedOff) await this.createNewState(farm_id, author);

    const oldState = [...this.#oldState];
    oldState[4] = this.#newState[3];
    oldState[6] = this.#newState[5];

    return await this.#baseRepo.update<Partial<StateModel>>(
      DB_TABLES.STATES,
      { id },
      {
        status: `#${oldState.join("-")}$`,
        is_off: true,
        end_date: new Date(),
      }
    );
  }

  private async checkCycleEquals(id: string) {
    const getLastCycle = await this.#baseRepo.findLast<CycleModel>(
      DB_TABLES.CYCLES,
      { state_id: id }
    );

    if (!getLastCycle) return;

    const { toList } = splitMsgCloud(getLastCycle?.status);

    return toList[2] === this.#newState[2];
  }

  private async handleStateEquals(farm_id: string, id: string) {
    const waterEquals = this.#oldState[2][0] === this.#newState[2][0];
    const directionEquals = this.#oldState[2][1] === this.#newState[2][1];
    const percentEquals = this.#oldState[3] === this.#newState[3];
    const angleEquals = this.#oldState[4] === this.#newState[4];

    if (!percentEquals || !angleEquals) {
      const oldState = [...this.#oldState];
      oldState[4] = this.#newState[3];
      oldState[6] = this.#newState[5];

      await this.#baseRepo.update<Partial<StateModel>>(
        DB_TABLES.STATES,
        { id },
        {
          status: `#${this.#oldState.join("-")}$`,
        }
      );
    }

    console.log("Iniciando checagem para salvar cycle");

    if (waterEquals && directionEquals) return;
    if (await this.checkCycleEquals(id)) return;

    return await this.createCycle(farm_id, id);
  }

  execute = async (data: { author?: string; payload: string[] }) => {
    this.initInstances();
    this.messageIsValid(data?.payload);

    const piv = await checkPivotExist(this.#newState[1]);
    const lastState = await this.getLastState(this.#newState[1]);

    if (!lastState) {
      return await this.createNewState(piv?.farm_id, data?.author);
    }

    this.#oldState = splitMsgCloud(lastState?.status)?.toList;

    if (this.twiceStatesIsOff()) return lastState;

    if (this.twicePowersEquals()) {
      await this.handleStateEquals(piv?.farm_id, lastState?.id);
      return lastState;
    }

    return await this.handleStateDiff(
      lastState?.id,
      piv?.farm_id,
      data?.author
    );
  };
}
