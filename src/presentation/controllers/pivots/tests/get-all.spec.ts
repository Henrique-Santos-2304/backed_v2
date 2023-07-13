import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
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

describe("Get All Pivot Integration", () => {
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

  it("[e2e] Should be return error if farm not exists ", async () => {
    const response = await request(server.getApp())
      .get("/pivots/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Fazenda não encontrada" });
  });

  it("[e2e] Should be return all pivots ", async () => {
    await createPivotFuncMock(user, farm?.id, {
      ...createPivotDataMock,
      farm_id: farm?.id,
      num: 1,
    });
    await createPivotFuncMock(user, farm?.id, {
      ...createPivotDataMock,
      farm_id: farm?.id,

      num: 2,
    });
    await createPivotFuncMock(user, farm?.id, {
      ...createPivotDataMock,
      farm_id: farm?.id,

      num: 3,
    });

    const response = await request(server.getApp())
      .get(`/pivots/${farm?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty("id");
  });

  it("[e2e] Should be return an empty array if farm not have pivots ", async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.PIVOTS
    );

    const response = await request(server.getApp())
      .get(`/pivots/${farm?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
