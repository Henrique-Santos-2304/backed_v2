import request from "supertest";
import { server } from "@root/app";
import { NewCloudMessages } from "@root/data";
import { Injector } from "@root/main/injector";
import { IAppDate, IBaseRepository } from "@root/domain";

import {
  DB_TABLES,
  IDPS,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
  createFarmFuncMock,
  createPivotFuncMock,
  createUserFuncMock,
} from "@root/shared";

describe("Get Pivot Cycle Integration", () => {
  let user = {} as any;
  let farm = {} as any;
  let pivot = {} as any;
  let date = "";
  let route = "/states";

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
    pivot = await createPivotFuncMock(user, farm?.id);

    date = Injector.get<IAppDate>(INJECTOR_COMMONS.APP_DATE)
      .dateSpString()
      .split(" ")[0]
      .replaceAll("/", "-");
    route += `/${pivot?.id}/${date}/${date}`;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.STATES
    );
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw Token not found ", async () => {
    console.log("Route, ", route);
    const response = await request(server.getApp()).get(route);
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .get(route)
      .set("Authorization", "Invalid Token");
    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw Pivot not exist ", async () => {
    const response = await request(server.getApp())
      .get(`/states/not_exists/${date}/${date}`)
      .set("Authorization", user?.token);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Pivô não encontrado");
  });

  it("[e2e] Should be return an empty array when not exists state on interval time", async () => {
    const response = await request(server.getApp())
      .get(route)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("[e2e] Should be return all states, cycles, and variables ", async () => {
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-140-date$`)
    );
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-200-date$`)
    );
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-250-date$`)
    );
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-451-080-120-270-date$`)
    );
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-451-080-120-320-date$`)
    );
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-052-080-120-360-date$`)
    );

    const response = await request(server.getApp())
      .get(route)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);

    expect(response.body[0]?.end_date).not.toEqual(null);
    expect(response.body[0]).toHaveProperty("is_off", true);
    expect(response.body[0].cycles).toHaveLength(1);
    expect(response.body[0].variables).toHaveLength(6);
  });

  it("[e2e] Should be cycle is running", async () => {
    await NewCloudMessages.start(
      Buffer.from(`#${IDPS.STATUS}-${pivot?.id}-351-080-120-140-date$`)
    );

    const response = await request(server.getApp())
      .get(route)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("end_date", null);
    expect(response.body[0]).toHaveProperty("is_off", false);

    expect(response.body[0].cycles).toHaveLength(0);
    expect(response.body[0].variables).toHaveLength(1);
  });
});
