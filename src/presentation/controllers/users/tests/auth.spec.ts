import { server } from "@root/app";
import { AppServer } from "@root/core";
import request from "supertest";
describe("Auth User Integration", () => {
  beforeAll(async () => {
    server.start();
    await request(server.getApp()).post("/users").send({
      username: "soil",
      password: "1234",
      user_type: "SUDO",
    });
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw Unauthorized if user not exists ", async () => {
    const promise = await request(server.getApp()).post("/users/auth").send({
      username: "not_exists",
      password: "1234",
    });
    expect(promise.body).toHaveProperty("error", "Invalid Credentials");
  });

  it("[e2e] Should be throw Unauthorized if received passphrase invalid ", async () => {
    const promise = await request(server.getApp()).post("/users/auth").send({
      username: "soil",
      password: "4321",
    });
    expect(promise.statusCode).toBe(400);
    expect(promise.body).toHaveProperty("error", "Invalid Credentials");
  });

  it("[e2e] Should be return all user data if user auth  ", async () => {
    const promise = await request(server.getApp()).post("/users/auth").send({
      username: "soil",
      password: "1234",
    });

    expect(promise.body).toHaveProperty("token");
    expect(promise.body).toHaveProperty("id");
    expect(promise.body).toHaveProperty("username", "soil");
    expect(promise.body).toHaveProperty("user_type", "SUDO");
  });
});
