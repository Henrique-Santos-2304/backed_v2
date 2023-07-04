import { server } from "@root/app";
import { AppServer } from "@root/core";
import { checkUserExists } from "@root/data/usecases/users/helpers";
import { IBaseRepository } from "@root/domain";
import { CreateFarmDto } from "@root/infra";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import request from "supertest";

const createObject: CreateFarmDto = {
  id: "new_farm",
  name: "name_farm",
  owner: "fail",
  latitude: -22,
  longitude: -44,
  city: "São Paulo",
  timezone: "America/Sao Paulo",
};

describe("Create Farm Integration", () => {
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

  it("[e2e] Should be return error if owner not exists ", async () => {
    const response = await request(server.getApp())
      .post("/farms")
      .set("Authorization", user?.token)
      .send(createObject);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Usuario não encontrado" });
  });

  it("[e2e] Should be return error if this farm_id already exists ", async () => {
    await request(server.getApp())
      .post("/farms")
      .set("Authorization", user?.token)
      .send({ ...createObject, owner: user?.id });

    const response = await request(server.getApp())
      .post("/farms")
      .set("Authorization", user?.token)
      .send({ ...createObject, owner: user?.id });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Fazenda já existe" });
  });

  it("[e2e] Should be return farm if action to have been finished with success ", async () => {
    const response = await request(server.getApp())
      .post("/farms")
      .set("Authorization", user?.token)
      .send({ ...createObject, owner: user?.id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", createObject.id);
    expect(response.body).toHaveProperty("name", createObject.name);
    expect(response.body).toHaveProperty("city", createObject.city);
    expect(response.body).toHaveProperty("latitude", createObject.latitude);
    expect(response.body).toHaveProperty("longitude", createObject.longitude);
    expect(response.body).toHaveProperty("owner", user?.id);
    expect(response.body).toHaveProperty("timezone", createObject.timezone);
  });
});
