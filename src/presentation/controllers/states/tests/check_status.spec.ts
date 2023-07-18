import request from "supertest";
import { server } from "@root/app";
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
import { Injector } from "@root/main/injector";
import { IBaseRepository, IIotConnect, IObservables } from "@root/domain";
import { ConnectionModel } from "@root/infra/models";

describe("Check Pivot Status Integration", () => {
  let user = {} as any;
  let farm = {} as any;
  let pivot = {} as any;
  let message = { data: "" };

  function doAsync(c: any) {
    setTimeout(() => {
      c();
    }, 3500 * 3);
  }

  jest.useFakeTimers();

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
    pivot = await createPivotFuncMock(user, farm?.id);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).get(`/states/${pivot?.id}`);
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .get(`/states/${pivot?.id}`)
      .set("Authorization", "Invalid Token");
    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw Pivot not exist ", async () => {
    const response = await request(server.getApp())
      .get(`/states/not_exists`)
      .set("Authorization", user?.token);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Pivô não encontrado");
  });

  it("[e2e] Should be not set connection false when status received ", async () => {
    const response = await request(server.getApp())
      .get(`/states/${pivot.id}`)
      .set("Authorization", user?.token);

    await Injector.get<IIotConnect>(INJECTOR_COMMONS.IOT_CONFIG).publisher(
      process.env.NEW_AWS_CLOUD,
      `#${IDPS.STATUS}-${pivot?.id}-351-080-120-360-date$`
    );

    const connection = await Injector.get<IBaseRepository>(
      INJECTOR_REPOS.BASE
    ).findLast<ConnectionModel>(DB_TABLES.CONNECTIONS, {
      pivot_id: pivot?.id,
    });

    expect(connection).toBeUndefined();
    expect(response.body).toEqual(`#${IDPS.STATUS}-${pivot?.id}$`);
  });
});
