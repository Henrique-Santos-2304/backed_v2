import request from "supertest";
import { server } from "@root/app";
import {
  IDPS,
  INJECTOR_OBSERVABLES,
  createFarmFuncMock,
  createPivotFuncMock,
  createUserFuncMock,
} from "@root/shared";
import { Injector } from "@root/main/injector";

describe("Create Action Integration", () => {
  let user = {} as any;
  let farm = {} as any;
  let pivot = {} as any;
  let message = { data: "" };

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
    pivot = await createPivotFuncMock(user, farm?.id);

    message.data = `#${IDPS.COMANDS}-${pivot?.id}-351-080-${user?.username}$`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw Token not found ", async () => {
    const response = await request(server.getApp()).post("/states");
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("[e2e] Should be throw Invalid Token ", async () => {
    const response = await request(server.getApp())
      .post("/states")
      .set("Authorization", "Invalid Token")
      .send(message);
    expect(response.statusCode).toBe(401);
    expect(response).toHaveProperty("text", "Invalid Token!");
  });

  it("[e2e] Should be throw Invalid format ", async () => {
    const response = await request(server.getApp())
      .post("/states")
      .set("Authorization", user?.token)
      .send({ data: `#${IDPS.COMANDS}-1$` });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Padrão de mensagem inválido"
    );
  });

  it("[e2e] Should be throw Pivot not exist ", async () => {
    const response = await request(server.getApp())
      .post("/states")
      .set("Authorization", user?.token)
      .send({ data: `#${IDPS.COMANDS}-not_exists-351-080-${user?.username}$` });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Pivô não encontrado");
  });

  it("[e2e] Should be action to have been added to observable with username author", async () => {
    await request(server.getApp())
      .post("/states")
      .set("Authorization", user?.token)
      .send(message);

    const exists = await Injector.get(INJECTOR_OBSERVABLES.ACTION).dispatch(
      pivot?.id
    );
    expect(exists).toBe(user?.username);
  });
});
