import { server } from "@root/app";
import { IBaseRepository } from "@root/domain";
import { Injector } from "@root/main/injector";
import {
  INJECTOR_REPOS,
  DB_TABLES,
  createUserFuncMock,
  createFarmFuncMock,
  createPivotDataMock,
} from "@root/shared";
import request from "supertest";

describe("Create Pivot Integration", () => {
  let user = {} as any;
  let farm = {} as any;

  beforeAll(async () => {
    server.start();

    user = await createUserFuncMock();
    farm = await createFarmFuncMock(user);
  });

  beforeEach(async () => {
    await Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE).deleteAll(
      DB_TABLES.PIVOTS
    );
  });

  beforeAll(async () => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be throw error if farm not  exists", async () => {
    const response = await request(server.getApp())
      .post("/pivots")
      .set("Authorization", user?.token)
      .send(createPivotDataMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Fazenda não encontrada");
  });

  it("[e2e] Should be throw error if pivot already  exists", async () => {
    await request(server.getApp())
      .post("/pivots")
      .set("Authorization", user?.token)
      .send({ ...createPivotDataMock, farm_id: farm?.id });

    const response = await request(server.getApp())
      .post("/pivots")
      .set("Authorization", user?.token)
      .send({ ...createPivotDataMock, farm_id: farm?.id });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Pivô já existe");
  });

  it("[e2e] Should be return a new pivot ", async () => {
    const response = await request(server.getApp())
      .post("/pivots")
      .set("Authorization", user?.token)
      .send({ ...createPivotDataMock, farm_id: farm?.id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "id",
      `${farm?.id}_${createPivotDataMock.num}`
    );
    expect(response.body).toHaveProperty("num", createPivotDataMock.num);
    expect(response.body).toHaveProperty(
      "latitude",
      createPivotDataMock.latitude
    );
    expect(response.body).toHaveProperty(
      "longitude",
      createPivotDataMock.longitude
    );
    expect(response.body).toHaveProperty(
      "start_angle",
      createPivotDataMock.start_angle
    );
    expect(response.body).toHaveProperty(
      "end_angle",
      createPivotDataMock.end_angle
    );
    expect(response.body).toHaveProperty("radius", createPivotDataMock.radius);
    expect(response.body).toHaveProperty(
      "is_gprs",
      createPivotDataMock.is_gprs
    );
    expect(response.body).toHaveProperty("last_state");
    expect(response.body).toHaveProperty("last_timestamp");
    expect(response.body).toHaveProperty("init_angle", 0);
  });
});
