import { server } from "@root/app";
import { AppServer } from "@root/core";
import { NewCloudMessages } from "@root/data";
import { IBaseRepository, IHashId } from "@root/domain";
import {
  ConnectionModel,
  CycleModel,
  FarmModel,
  PivotModel,
  StateModel,
  StateVariableModel,
  UserModel,
} from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  DB_TABLES,
  IDPS,
  INJECTOR_COMMONS,
  INJECTOR_OBSERVABLES,
  INJECTOR_REPOS,
  createFarmFuncMock,
  createPivotFuncMock,
  createUserFuncMock,
} from "@root/shared";
import request from "supertest";

describe("Auth User Integration", () => {
  let user = {} as any;
  let farm = {} as FarmModel;
  let pivot = {} as PivotModel;

  let message = "";
  let buffer = "" as unknown as Buffer;
  let baseRepo: IBaseRepository;

  beforeAll(async () => {
    server.start();
    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
    pivot = await createPivotFuncMock(user, farm?.id);

    message = `#${IDPS.STATUS}-${pivot?.id}-351-080-120-360-date$`;
    buffer = Buffer.from(message);
    baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("Should be throw Pivot not exists", async () => {
    const result = NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-não_exist-351-080-120-360-date$`)
    );

    await expect(result).rejects.toThrow(new Error("Pivô não encontrado"));
  });

  it("Should be last state to save correct and create new state and variable", async () => {
    const result = await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-360-date$`)
    );

    const piv = await baseRepo.findOne<PivotModel>(DB_TABLES.PIVOTS, {
      id: pivot?.id,
    });

    const variable = await baseRepo.findOne<StateVariableModel>(
      DB_TABLES.STATE_VARIABLES,
      {
        state_id: result?.id,
      }
    );

    expect(piv.last_state).toContain(
      `#${IDPS.STATUS}-${pivot?.id}-351-080-120-360`
    );
    expect(result?.state?.status).toContain("manual");
    expect(result?.state?.status).toContain("351");
    expect(result?.state?.status).toContain("080-120-360");
    expect(variable).toHaveProperty("id");
  });

  it("Should be set a connection true if old value is offline", async () => {
    await baseRepo.create<ConnectionModel>(DB_TABLES.CONNECTIONS, {
      pivot_id: pivot?.id,
      id: Injector.get<IHashId>(INJECTOR_COMMONS.APP_HASH).generate(),
      loss_date: new Date(),
      timestamp: new Date(),
    });

    expect(
      await baseRepo.findLast<ConnectionModel>(DB_TABLES.CONNECTIONS, {
        pivot_id: pivot?.id,
      })
    ).toHaveProperty("recovery_date", null);

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-095-120-360-date$`)
    );

    const connection = await baseRepo.findLast<ConnectionModel>(
      DB_TABLES.CONNECTIONS,
      { pivot_id: pivot?.id }
    );

    expect(connection.recovery_date).not.toEqual(null);
  });

  it("Should be create new variable for state", async () => {
    const result = await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-095-120-360-date$`)
    );

    const variables = await baseRepo.findAllByData<StateVariableModel>(
      DB_TABLES.STATE_VARIABLES,
      {
        state_id: result?.id,
      }
    );

    expect(variables).toHaveLength(2);
  });

  it("Should be nothing happens when power is true", async () => {
    const oldState = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-360-date$`)
    );
    const state = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    expect(state.id).toEqual(oldState.id);
  });

  it("Should be create a new cycle for this state when changed  direction only", async () => {
    const oldState = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-451-080-120-360-date$`)
    );
    const cycle = await baseRepo.findLast<CycleModel>(DB_TABLES.CYCLES, {
      state_id: oldState?.id,
    });

    expect(cycle).toHaveProperty("state_id", oldState.id);
  });

  it("Should be create a new cycle for this state when changed  water only", async () => {
    const oldState = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-461-080-120-360-date$`)
    );
    const cycle = await baseRepo.findLast<CycleModel>(DB_TABLES.CYCLES, {
      state_id: oldState?.id,
    });

    expect(cycle).toHaveProperty("state_id", oldState.id);
  });

  it("Should be nothing happens when cycle is equals at last", async () => {
    const oldState = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-461-080-120-360-date$`)
    );
    const cycle = await baseRepo.findAllByData<CycleModel>(DB_TABLES.CYCLES, {
      state_id: oldState?.id,
    });

    expect(cycle).toHaveLength(2);
  });

  it("Should be to finally the state when status to be false", async () => {
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-052-080-120-360-date$`)
    );

    const state = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    expect(state).toHaveProperty("is_off", true);
  });

  it("Should be nothing happens when power is false", async () => {
    const oldState = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-052-080-120-360-date$`)
    );

    const state = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    expect(state.id).toEqual(oldState.id);
  });

  it("Should be create a new state with author", async () => {
    await baseRepo.deleteAll(DB_TABLES.STATES);
    await baseRepo.deleteAll(DB_TABLES.CONNECTIONS);
    await baseRepo.deleteAll(DB_TABLES.CYCLES);

    await Injector.get(INJECTOR_OBSERVABLES.ACTION).subscribe({
      action: `#${IDPS.COMANDS}-${pivot?.id}-351-080-${user?.username}$`,
      topic: pivot?.id,
      oldMessage: message,
    });

    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-360-date$`)
    );

    const result = await baseRepo.findLast<StateModel>(DB_TABLES.STATES, {
      pivot_id: pivot?.id,
    });

    expect(result.status).toContain(user?.username);
  });
});
