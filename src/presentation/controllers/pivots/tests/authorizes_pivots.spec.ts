import { server } from "@root/app";
import { AppServer } from "@root/core";
import { createUserFuncMock } from "@root/shared";
import request from "supertest";
describe("Check Authorizes on crud pivots Integration", () => {
  let user = {} as any;

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });
  /*


                      CREATE Pivot

  */
  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp())
      .post("/pivots")
      .set("Authorization", "")
      .send({
        id: "error",
      });
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });
  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .post("/pivots")
      .set("Authorization", "Invalid Token")
      .send({
        id: "error",
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
      .post("/pivots")
      .set("Authorization", userReq?.body.token)
      .send({
        id: "error",
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
      .post("/pivots")
      .set("Authorization", userReq?.body.token)
      .send({
        id: "error",
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
      .post("/pivots")
      .set("Authorization", userReq?.body.token)
      .send({
        id: "error",
      });

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  /*


                      DELETE FARM

  */
  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).del("/pivots/id");
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });
  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .del("/pivots/id")
      .set("Authorization", "Invalid Token");

    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw user Unauthorized if user is WORKER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del_farm",
      password: "1234",
      user_type: "WORKER",
    });
    const response = await request(server.getApp())
      .del("/pivots/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is DEALER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del_farm_dealer",
      password: "1234",
      user_type: "DEALER",
    });
    const response = await request(server.getApp())
      .del("/pivots/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is OWNER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "del_farm_owner",
      password: "1234",
      user_type: "OWNER",
    });
    const response = await request(server.getApp())
      .del("/pivots/id")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  /*


                      UPDATE FARM

  */
  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).put("/pivots");
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });
  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .put("/pivots")
      .set("Authorization", "Invalid Token");

    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw user Unauthorized if user is WORKER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "put_farm",
      password: "1234",
      user_type: "WORKER",
    });
    const response = await request(server.getApp())
      .put("/pivots")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is DEALER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "put_farm_dealer",
      password: "1234",
      user_type: "DEALER",
    });
    const response = await request(server.getApp())
      .put("/pivots")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });

  it("[e2e] Should be throw user Unauthorized if user is OWNER ", async () => {
    const userReq = await request(server.getApp()).post("/users").send({
      username: "put_farm_owner",
      password: "1234",
      user_type: "OWNER",
    });
    const response = await request(server.getApp())
      .put("/pivots")
      .set("Authorization", userReq?.body.token);

    expect(response.text).toEqual("Usuário não tem acesso para ação");
  });
});
