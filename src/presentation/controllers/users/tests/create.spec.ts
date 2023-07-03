import { AppServer } from "@root/core";
import { IBaseRepository } from "@root/domain";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import request from "supertest";
describe("Create User Integration", () => {
  const server = new AppServer();
  beforeAll(() => {
    server.start();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw error if user already exists ", async () => {
    await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "SUDO",
    });

    const promise = await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "SUDO",
    });
    expect(promise.statusCode).toBe(400);
    expect(promise.body).toHaveProperty("error", "Usuario já existe");

    Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).delete(DB_TABLES.USERS, {
      username: "soil",
    });
  });

  it("[e2e] Should be throw error if user already exists ", async () => {
    const promise = await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "TEST",
    });
    expect(promise.body).toHaveProperty("error", "User Type Is Invalid");
  });
  it("[e2e] Should be create a new user and return token, login, user_type data  ", async () => {
    const promise = await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "SUDO",
    });

    expect(promise.body).toHaveProperty("token");
    expect(promise.body).toHaveProperty("username", "soil");
    expect(promise.body).toHaveProperty("user_type", "SUDO");
  });
});
