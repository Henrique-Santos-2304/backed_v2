import { server } from "@root/app";
import { CreatePivotDto } from "@root/infra";
import { PivotModel, UserModel } from "@root/infra/models";
import request from "supertest";

export const createPivotDataMock: CreatePivotDto = {
  farm_id: "farm_for_pivots",
  num: 1,
  latitude: -22,
  longitude: -44,
  start_angle: 0,
  end_angle: 360,
  radius: 220,
  is_gprs: true,
};

export const createPivotFuncMock = async (
  user: UserModel & { token: string },
  farm_id: string,
  data?: CreatePivotDto
) => {
  const response = await request(server.getApp())
    .post("/pivots")
    .set("Authorization", user?.token)
    .send(data ?? { ...createPivotDataMock, farm_id });

  return response.body as PivotModel;
};
