import { server } from "@root/app";
import { AppServer } from "@root/core";
import { checkUserExists } from "@root/data/usecases/users/helpers";
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
    const response = await request(server.getApp()).delete("/users/id");
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .del("/users/id")
      .set("Authorization", "Invalid Token")
      .send({
        user_id: "error",
      });
    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw user Unauthorized if user is WORKER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del",
      password: "1234",
      user_type: "WORKER",
    });
    const response = await request(server.getApp())
      .del("/users/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is DEALER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del_dealer",
      password: "1234",
      user_type: "DEALER",
    });
    const response = await request(server.getApp())
      .del("/users/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is OWNER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del_owner",
      password: "1234",
      user_type: "OWNER",
    });
    const response = await request(server.getApp())
      .del("/users/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user not found if received user_id invalid ", async () => {
    const response = await request(server.getApp())
      .del("/users/invalid_id")
      .set("Authorization", user?.token);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Usuario não encontrado" });
  });

  it("[e2e] Should be del user is ocurred all fine ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "for_del",
      password: "1234",
      user_type: "OWNER",
    });

    const checkFirst = await checkUserExists({ username: "for_del" });

    expect(checkFirst).toHaveProperty("username", "for_del");

    await request(server.getApp())
      .del(`/users/${userReq?.body.id}`)
      .set("Authorization", user?.token);

    const checkFinal = await Injector.get<IBaseRepository>(
      INJECTOR_REPOS.BASE
    ).findOne(DB_TABLES.USERS, { username: "for_del" });

    expect(checkFinal).toBe(null);
  });
});
