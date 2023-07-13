import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { FarmModel, UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  DB_TABLES,
  INJECTOR_REPOS,
  createFarmFuncMock,
  createPivotDataMock,
  createPivotFuncMock,
  createUserFuncMock,
} from "@root/shared";
import request from "supertest";

describe("Get One Pivot Integration", () => {
  let user = {} as any;
  let farm = {} as any;

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be return pivot correctly", async () => {
    await createPivotFuncMock(user, farm?.id, {
      ...createPivotDataMock,
      farm_id: farm?.id,
      num: 1,
    });

    const response = await request(server.getApp())
      .get(`/pivots/by_id/${farm?.id}_1`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("[e2e] Should be return undefined ", async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.PIVOTS
    );

    const response = await request(server.getApp())
      .get(`/pivots/by_id/${farm?.id}_1`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(null);
  });
});
