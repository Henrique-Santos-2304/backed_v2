import { AppServer } from "@root/core";
import { checkUserExists } from "@root/data/usecases/users/helpers";
import request from "supertest";
describe("Update User Integration", () => {
  let user = {} as any;
  const server = new AppServer();

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
    const response = await request(server.getApp()).put("/users").send({
      user_id: "error",
    });
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });
  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .put("/users")
      .set("Authorization", "Invalid Token")
      .send({
        user_id: "error",
      });
    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw user Unauthorized if user is WORKER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "test",
      password: "1234",
      user_type: "WORKER",
    });
    const response = await request(server.getApp())
      .put("/users")
      .set("Authorization", userReq?.body.token)
      .send({
        user_id: "error",
      });

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is DEALER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "test_dealer",
      password: "1234",
      user_type: "DEALER",
    });
    const response = await request(server.getApp())
      .put("/users")
      .set("Authorization", userReq?.body.token)
      .send({
        user_id: "error",
      });

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is OWNER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "test_owner",
      password: "1234",
      user_type: "OWNER",
    });
    const response = await request(server.getApp())
      .put("/users")
      .set("Authorization", userReq?.body.token)
      .send({
        user_id: "error",
      });

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user not found if received user_id invalid ", async () => {
    const response = await request(server.getApp())
      .put("/users")
      .set("Authorization", user?.token)
      .send({
        user_id: "error",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Usuario não encontrado" });
  });

  it("[e2e] Should be return all user data if user auth  ", async () => {
    const userFounded = await checkUserExists({ username: "soil" });
    const promise = await request(server.getApp())
      .put("/users")
      .set("Authorization", user?.token)
      .send({
        user_id: userFounded.user_id,
        username: "soil",
        password: "4321",
        user_type: "SUDO",
      });

    expect(promise.body).toHaveProperty("user_id");
    expect(promise.body).toHaveProperty("username", "soil");
    expect(promise.body).toHaveProperty("user_type", "SUDO");

    const result = await request(server.getApp()).post("/users/auth").send({
      username: "soil",
      password: "4321",
    });

    expect(result.body).toHaveProperty("token");
  });
});
