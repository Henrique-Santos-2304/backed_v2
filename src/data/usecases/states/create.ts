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
  IBaseRepository,
  IBaseUseCases,
  IHashId,
  SendMessageSignalType,
} from "@root/domain";

export class CreateStateUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #sendMessageSignal: IBaseUseCases<SendMessageSignalType>;
  #oldState: string[];
  #newState: string[];

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#sendMessageSignal = Injector.get(
      INJECTOR_CASES.COMMONS.SEND_MESSAGES_SIGNAL
    );
  }

  private async getLastState(id: string) {
    const lastState = await getLastStateFull(id);

    const { toList } = splitMsgCloud(lastState.status);
    this.#oldState = toList;
    return lastState;
  }

  private async sendMessageSignal(farm_id: string, newState: CreateStateDto) {
    const powerEquals = this.#oldState[2] === this.#newState[2][2];

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
    this.#newState[5] = author || "manual";
    const status = `#${this.#newState.join("-")}-running$`;

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

    return await this.#baseRepo.create(DB_TABLES.STATES, stateEntity);
  }

  private async createCycle(farm_id: string, id: string) {
    const entity = new MutationCycleVO().create(
      Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH),
      {
        state_id: id,
        status: `#${this.#newState.join("-")}-running$`,
      }
    );

    await this.sendMessageSignal(farm_id, {
      pivot_id: this.#newState[1],
      status,
    });

    return await this.#baseRepo.create(DB_TABLES.CYCLES, entity);
  }

  private messageIsValid(payload: string[]) {
    console.warn("____________________________________");
    console.warn("____________________________________");
    console.warn("____________________________________");
    console.warn("____________________________________");
    console.warn("____________________________________");

    console.log("Payload ", JSON.stringify(payload));
    if (payload?.length !== 6) {
      throw new Error("Padrão de mensgaem inválido");
    }

    this.#newState = payload;
  }

  private async handleStateDiff(id: string, farm_id: string, author?: string) {
    const itWasTurnedOff = this.#oldState[2][2] === "2";
    this.#oldState[6] = author || "manual";

    if (itWasTurnedOff) await this.createNewState(farm_id, author);

    return await this.#baseRepo.update<Partial<StateModel>>(
      DB_TABLES.STATES,
      { id },
      {
        status: `#${this.#oldState.join("-")}$`,
        end_variable: `#${IDPS.STATUS}-${this.#newState[3]}-${
          this.#newState[4]
        }$`,
        is_off: true,
        end_date: new Date(),
      }
    );
  }

  private async checkCycleEquals(id: string) {
    const getLastCycle = await this.#baseRepo.findOne<CycleModel>(
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
      await this.#baseRepo.update<Partial<StateModel>>(
        DB_TABLES.STATES,
        { id },
        {
          end_variable: `#${this.#newState[3]}-${this.#newState[4]}$`,
        }
      );
    }

    if (waterEquals && directionEquals) return;
    if (await this.checkCycleEquals(id)) return;

    return await this.createCycle(farm_id, id);
  }

  execute = async (data: { author?: string; payload: string[] }) => {
    this.initInstances();
    this.messageIsValid(data?.payload);

    const piv = await checkPivotExist(this.#newState[1]);
    const lastState = await this.getLastState(this.#newState[1]);
    this.#oldState = splitMsgCloud(lastState.status).toList;

    if (this.twiceStatesIsOff()) return;

    if (this.twicePowersEquals()) {
      return await this.handleStateEquals(piv?.farm_id, lastState?.id);
    }

    return await this.handleStateDiff(
      lastState?.id,
      piv?.farm_id,
      data?.author
    );
  };
}
