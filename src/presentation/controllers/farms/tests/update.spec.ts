import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { FarmModel, UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import request from "supertest";

describe("Update Farm Integration", () => {
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
      .put("/farms/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Fazenda não encontrada" });
  });

  it("[e2e] Should be not put if new data is equals an old data ", async () => {
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
      .put(`/farms/${farm.id}`)
      .set("Authorization", user?.token)
      .send(farm);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "Dados iguais nada para atualizar",
    });
  });

  it("[e2e] Should be added a new worker into farm and after remove this worker ", async () => {
    const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);

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

    const farm = await baseRepo.findOne<FarmModel>(DB_TABLES.FARMS, {
      id: "farm_for_del",
    });

    const added = await request(server.getApp())
      .put(`/farms/${farm.id}`)
      .set("Authorization", user?.token)
      .send({
        type: "ADD_WORKER",
        id: farm?.id,
        username: "worker_of_farm",
        password: "1234",
      });

    const newUser = await baseRepo.findOne<UserModel>(DB_TABLES.USERS, {
      username: "worker_of_farm",
    });

    expect(added.statusCode).toBe(200);
    expect(added.body.workers).toHaveLength(1);
    expect(newUser).toHaveProperty("id");

    const response = await request(server.getApp())
      .put(`/farms/${farm.id}`)
      .set("Authorization", user?.token)
      .send({
        type: "REMOVE_WORKER",
        id: farm?.id,
        worker: newUser?.username,
      });

    const delUser = await baseRepo.findOne<UserModel>(DB_TABLES.USERS, {
      username: "worker_of_farm",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.workers).toHaveLength(0);
    expect(delUser).toBe(null);
  });

  it("[e2e] Should be put farm with sucess ", async () => {
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
      .put(`/farms/${farm.id}`)
      .set("Authorization", user?.token)
      .send({ ...farm, type: "FULL", id: "changed_id" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", "changed_id");
  });

  it("[e2e] Should be put farm_id and exists pivot, put pivot id too", async () => {
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

    const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
    const farm = await baseRepo.findOne<FarmModel>(DB_TABLES.FARMS, {
      id: "farm_for_del",
    });

    await baseRepo.create(DB_TABLES.PIVOTS, {
      id: `${farm?.id}_1`,
      num: 1,
      farm_id: farm?.id,
      latitude: -22,
      longitude: -44,
      last_state: `#0-${
        farm?.id
      }_1-000-000-000-000-${new Date().toISOString()}`,
      last_timestamp: new Date(),
      start_angle: 0,
      end_angle: 360,
      radius: 360,
      is_gprs: true,
      ip_gateway: "",
    });

    const response = await request(server.getApp())
      .put(`/farms/${farm.id}`)
      .set("Authorization", user?.token)
      .send({ ...farm, type: "FULL", id: "changedId" });

    const piv = await baseRepo.findAll(DB_TABLES.PIVOTS);

    expect(response.statusCode).toBe(200);
    expect(piv[0]).toHaveProperty("id", "changedId_1");
  });
});
