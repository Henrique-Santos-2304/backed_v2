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

describe("Update Pivot Integration", () => {
  let user = {} as any;

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
  });

  beforeEach(async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.FARMS
    );
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be return error if pivot not exists ", async () => {
    const response = await request(server.getApp())
      .put("/pivots")
      .set("Authorization", user?.token)
      .send({ farm_id: "not_exists" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Pivô não encontrado" });
  });

  it("[e2e] Should be received manual other pivot_id, not alter id ", async () => {
    const farm = await createFarmFuncMock(user);
    const piv = await createPivotFuncMock(user, farm?.id);

    expect(piv.id).toEqual(`${farm?.id}_${createPivotDataMock.num}`);

    const response = await request(server.getApp())
      .put(`/pivots`)
      .set("Authorization", user?.token)
      .send({ ...piv, id: "altered" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Pivô não encontrado" });
  });

  it("[e2e] Should be not put if new data is equals an old data ", async () => {
    const farm = await createFarmFuncMock(user);
    const piv = await createPivotFuncMock(user, farm?.id);

    expect(piv.id).toEqual(`${farm?.id}_${createPivotDataMock.num}`);

    const response = await request(server.getApp())
      .put(`/pivots`)
      .set("Authorization", user?.token)
      .send({ ...piv, num: 3 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", `${farm?.id}_3`);
  });
});
