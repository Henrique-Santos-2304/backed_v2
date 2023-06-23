import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
} from "@root/domain";
import { StateModel, StateVariableModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";
import { getLastStateFull } from "../states/helpers/get-state";
import { checkPivotExist } from "../pivots/helpers";

export class ReceveidStatus implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #saveLastState: IBaseUseCases;
  #createState: IBaseUseCases;
  #createVariable: IBaseUseCases;
  #actioObserver: IObservables;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#saveLastState =
      this.#saveLastState ??
      Injector.get(INJECTOR_CASES.PIVOTS.SAVE_LAST_STATE);

    this.#createState =
      this.#createState ?? Injector.get(INJECTOR_CASES.STATES.CREATE);

    this.#createVariable =
      this.#createVariable ??
      Injector.get(INJECTOR_CASES.STATE_VARIABLES.CREATE);

    this.#actioObserver =
      this.#actioObserver ?? Injector.get(INJECTOR_OBSERVABLES.ACTION);
  }

  private async saveLasteState(payload: string) {
    await this.#saveLastState?.execute({ payload, isGateway: false });
  }

  private async createState(
    pivot_id: string,
    state: string,
    author: string | null
  ): Promise<StateModel> {
    return await this.#createState.execute({
      pivot_id,
      author,
      connection: true,
      power: state[2] === "1",
      water: state[1] === "6",
      direction: state[0] === "3" ? "CLOCKWISE" : "ANTI_CLOCKWISE",
    });
  }

  private async createVariable(
    state_id: string,
    percent: string,
    angle: string
  ): Promise<StateVariableModel | undefined> {
    return await this.#createVariable?.execute({
      state_id,
      percentimeter: Number(percent) || 0,
      angle: Number(angle),
    });
  }

  private splitMessage(payload: string) {
    const arrayMessage = payload.split("-");
    if (arrayMessage.length !== 6) throw new Error("Formato Inválido");
    return arrayMessage;
  }

  async execute(payload: string) {
    this.initInstances();

    const [_, pivot_id, state, percent, angle, __] = this.splitMessage(payload);

    await checkPivotExist(this.#baseRepo.findOne, pivot_id);
    const author = await this.#actioObserver.dispatch(pivot_id);

    await this.saveLasteState(payload);

    const newState = await this.createState(pivot_id, state, author || null);

    const state_id =
      newState?.state_id ||
      (await getLastStateFull(this.#baseRepo.findLast, pivot_id))?.state_id;

    if (!state_id) return;

    const newVariable = await this.createVariable(state_id, percent, angle);
  }
}
