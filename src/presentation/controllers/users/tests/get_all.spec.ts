import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

import request from "supertest";
describe("Delete User Integration", () => {
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

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).get("/users");

    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .get("/users")
      .set("Authorization", "Invalid");

    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw user Unauthorized if user is WORKER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "get",
      password: "1234",
      user_type: "WORKER",
    });
    const response = await request(server.getApp())
      .get("/users")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is DEALER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "get_dealer",
      password: "1234",
      user_type: "DEALER",
    });
    const response = await request(server.getApp())
      .get("/users")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is OWNER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "get_owner",
      password: "1234",
      user_type: "OWNER",
    });
    const response = await request(server.getApp())
      .get("/users")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });
  it("[e2e] Should be return all users ", async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.USERS
    );

    for (let count = 0; count < 3; count++) {
      await request(server.getApp())
        .post("/users")
        .send({
          username: `new_user_${count}`,
          password: "1234",
          user_type:
            count === 0
              ? "WORKER"
              : count === 1
              ? "DEALER"
              : count === 2
              ? "OWNER"
              : "SUDO",
        });
    }

    const userReq = await request(server.getApp()).post("/users").send({
      username: "get_sudo",
      password: "1234",
      user_type: "SUDO",
    });

    const response = await request(server.getApp())
      .get("/users")
      .set("Authorization", userReq?.body.token);

    expect(response.body).toHaveLength(4);
  });
});
