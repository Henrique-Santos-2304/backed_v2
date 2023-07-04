import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import request from "supertest";

describe("Delete Farm Integration", () => {
  let user = {} as any;

  beforeAll(async () => {
    server.start();
    await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "SUDO",
    });

    const response = await request(server.getApp()).post("/users/auth").send({
      username: "soil",
      password: "1234",
    });

    user = response.body;
  });

  beforeEach(async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.FARMS
    );
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be return error if farm not exists ", async () => {
    const response = await request(server.getApp())
      .del("/farms/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Fazenda não encontrada" });
  });

  it("[e2e] Should be return farm if action to have been finished with success ", async () => {
    await request(server.getApp())
      .post("/farms")
      .set("Authorization", user?.token)
      .send({
        owner: user?.id,
        id: "farm_for_del",
        name: "farm_del",
        city: "SP",
        latitude: -22,
        longitude: -44,
        timezone: "America/Sao Paulo",
      });

    const farm = await Injector.get<IBaseRepository>(
      INJECTOR_REPOS.BASE
    ).findOne<FarmModel>(DB_TABLES.FARMS, {
      id: "farm_for_del",
    });

    const response = await request(server.getApp())
      .del(`/farms/${farm.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
  });
});
