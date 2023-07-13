import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { FarmModel } from "@root/infra/models";
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

describe("Delete Pivot Integration", () => {
  let user = {} as any;

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be return error if pivot not exists ", async () => {
    const response = await request(server.getApp())
      .del("/pivots/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Pivô não encontrado" });
  });

  it("[e2e] Should be return farm if action to have been finished with success ", async () => {
    const farm = await createFarmFuncMock(user);
    await createPivotFuncMock(user, farm?.id);

    const id = `${farm?.id}_${createPivotDataMock.num}`;

    const pivot = await Injector.get<IBaseRepository>(
      INJECTOR_REPOS.BASE
    ).findOne<FarmModel>(DB_TABLES.PIVOTS, {
      id,
    });

    const response = await request(server.getApp())
      .del(`/pivots/${id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
  });
});
