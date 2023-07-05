import { server } from "@root/app";
import { checkUserExists } from "@root/data/usecases/users/helpers";
import { IBaseRepository } from "@root/domain";
import { CreateFarmDto } from "@root/infra";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import {
  DB_TABLES,
  INJECTOR_REPOS,
  addUserIntoFarmMock,
  createFarmDataMock,
  createFarmFuncMock,
  createUserDataMock,
  createUserFuncMock,
} from "@root/shared";
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

describe("Delete Farm Integration", () => {
  let user = {} as any;
  let dealer = {} as any;
  let owner = {} as any;
  let farmWithWorker: any = {};

  beforeAll(async () => {
    server.start();
    user = await createUserFuncMock();

    dealer = await createUserFuncMock({
      ...createUserDataMock,
      user_type: "DEALER",
      username: "dealer_soil",
    });

    owner = await createUserFuncMock({
      ...createUserDataMock,
      user_type: "OWNER",
      username: "owner_soil",
    });

    await createFarmFuncMock(user, {
      ...createFarmDataMock,
      id: "dealer_farm",
      dealer: dealer?.id!,
      owner: owner?.id!,
    });

    await createFarmFuncMock(user, {
      ...createFarmDataMock,
      id: "dealer2_farm",
      dealer: dealer?.id!,
      owner: owner?.id!,
    });

    const farm = await createFarmFuncMock(user, {
      ...createFarmDataMock,
      id: "dealer3_farm",
      owner: user.id,
    });

    farmWithWorker = await addUserIntoFarmMock(user, farm?.id, {
      username: "worker_soil",
      password: "1234",
    });
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  // Middleware Token
  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).get("/farms/id");
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });
  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .get("/farms/id")
      .set("Authorization", "Invalid Token");

    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  // Request

  it("[e2e] Should be return error if user not exists ", async () => {
    const response = await request(server.getApp())
      .get("/farms/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Usuario não encontrado" });
  });

  it("[e2e] Should be return error if user not exists ", async () => {
    const response = await request(server.getApp())
      .get("/farms/id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Usuario não encontrado" });
  });

  it("[e2e] Should be return all farms of dealer ", async () => {
    const response = await request(server.getApp())
      .get(`/farms/${dealer?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("dealer", dealer?.id);
  });

  it("[e2e] Should be return all farms of owner ", async () => {
    const response = await request(server.getApp())
      .get(`/farms/${owner?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("owner", owner?.id);
  });

  it("[e2e] Should be return all farms of workers ", async () => {
    const getWorker = await checkUserExists({ username: "worker_soil" });
    const response = await request(server.getApp())
      .get(`/farms/${getWorker?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("workers", [getWorker?.username]);
  });

  it("[e2e] Should be return all farms if user is SUDO ", async () => {
    const response = await request(server.getApp())
      .get(`/farms/${user?.id}`)
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(3);
  });
});
