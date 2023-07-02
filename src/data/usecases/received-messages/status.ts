import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  IObservables,
  IWriteLogs,
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
import { CheckPressure } from "../states";

export class ReceveidStatus implements IBaseUseCases {
  #checkPresure: CheckPressure;
  #saveLastState: IBaseUseCases;
  #createState: IBaseUseCases;
  #createVariable: IBaseUseCases;
  #actionObserver: IObservables;
  #angleObserver: IObservables;

  private initInstances() {
    this.#checkPresure = Injector.get(INJECTOR_CASES.STATES.PRESSURE);

    this.#saveLastState = Injector.get(INJECTOR_CASES.PIVOTS.SAVE_LAST_STATE);

    this.#createState = Injector.get(INJECTOR_CASES.STATES.CREATE);

    this.#createVariable = Injector.get(INJECTOR_CASES.STATE_VARIABLES.CREATE);

    this.#actionObserver = Injector.get(INJECTOR_OBSERVABLES.ACTION);

    this.#angleObserver = Injector.get(INJECTOR_OBSERVABLES.ANGLE_JOB);
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

  private async checkPivotInPressure(
    pivot_id: string,
    state: string,
    payload: string[]
  ) {
    const exists = this.#checkPresure?.check(pivot_id);

    const is_pressure = state[1] === "7";

    if (!exists && !is_pressure) return;
    if (exists && is_pressure) return true;

    const isFinalPressure = exists && !is_pressure;

    isFinalPressure
      ? this.#checkPresure.dispatch(payload)
      : this.#checkPresure.execute(payload);

    return true;
  }

  async execute(payload: string[]) {
    this.initInstances();

    const [_, pivot_id, state, percent, angle, __] = payload;

    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "MESSAGE",
      pivot_id,
      payload.join("-")
    );

    await checkPivotExist(pivot_id);

    const inPressure = await this.checkPivotInPressure(
      pivot_id,
      state,
      payload
    );

    if (inPressure) return;

    this.#angleObserver.dispatch(pivot_id, Number(angle));
    const author = await this.#actionObserver.dispatch(pivot_id);

    await this.saveLasteState(payload.join("-"));

    const newState =
      (await this.createState(pivot_id, state, author || null)) ||
      (await getLastStateFull(pivot_id));

    if (!newState?.state_id) return;

    await this.createVariable(newState?.state_id, percent, angle);
  }
}
