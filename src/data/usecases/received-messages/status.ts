import { CheckPressure } from "../states";
import { Injector } from "@root/main/injector";
import { checkPivotExist } from "../pivots/helpers";
import {
  ConnectionModel,
  StateModel,
  StateVariableModel,
} from "@root/infra/models";
import { getLastStateFull } from "../states/helpers/get-state";
import {
  IBaseRepository,
  IBaseUseCases,
  IObservables,
  IWriteLogs,
} from "@root/domain";

import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
} from "@root/shared";

export class ReceveidStatus implements IBaseUseCases {
  #writeLogs: IWriteLogs;
  #checkPresure: CheckPressure;
  #saveLastState: IBaseUseCases;
  #createState: IBaseUseCases;
  #createVariable: IBaseUseCases;
  #actionObserver: IObservables;
  #angleObserver: IObservables;
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#writeLogs = Injector.get(INJECTOR_COMMONS.WRITE_LOGS);
    this.#checkPresure = Injector.get(INJECTOR_CASES.STATES.PRESSURE);

    this.#saveLastState = Injector.get(INJECTOR_CASES.PIVOTS.SAVE_LAST_STATE);

    this.#createState = Injector.get(INJECTOR_CASES.STATES.CREATE);

    this.#createVariable = Injector.get(INJECTOR_CASES.STATE_VARIABLES.CREATE);

    this.#actionObserver = Injector.get(INJECTOR_OBSERVABLES.ACTION);

    this.#angleObserver = Injector.get(INJECTOR_OBSERVABLES.ANGLE_JOB);
    this.#baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  }

  private async createState(
    state: string[],
    author: string | null
  ): Promise<StateModel> {
    return await this.#createState.execute({
      author,
      payload: state,
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

    if ((!is_pressure && !exists) || (exists && is_pressure)) return;

    exists && !is_pressure
      ? this.#checkPresure.dispatch(payload)
      : this.#checkPresure.execute(payload);
  }

  private async checkConnection(pivot_id: string) {
    const alreadyExists = await this.#baseRepo.findLast<ConnectionModel>(
      DB_TABLES.CONNECTIONS,
      { pivot_id }
    );

    if (!alreadyExists || alreadyExists?.recovery_date) return;

    await this.#baseRepo.update<Partial<ConnectionModel>>(
      DB_TABLES.CONNECTIONS,
      { id: alreadyExists.id },
      { recovery_date: new Date() }
    );
  }

  async execute(payload: string[]) {
    this.initInstances();

    const [_, pivot_id, state, percent, start_angle, angle, __] = payload;

    this.#writeLogs.write("MESSAGE", pivot_id, payload.join("-"));
    await checkPivotExist(pivot_id);
    await this.#saveLastState?.execute({ payload, isGateway: false });
    await this.checkConnection(pivot_id);

    await this.checkPivotInPressure(pivot_id, state, payload);

    if (state[1] === "7") return;

    this.#angleObserver.dispatch(pivot_id, Number(angle));
    const author = await this.#actionObserver.dispatch(pivot_id);

    const newState = await this.createState(payload, author || null);

    if (!newState?.id) return;

    const variable = await this.createVariable(newState?.id, percent, angle);

    return { state: newState, variable };
  }
}
