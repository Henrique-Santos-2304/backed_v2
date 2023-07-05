import { server } from "@root/app";
import { CreateFarmDto, CreateUserDto } from "@root/infra";
import { FarmModel, UserModel } from "@root/infra/models";
import request from "supertest";

export const createFarmDataMock: CreateFarmDto = {
  id: "new_farm",
  name: "name_farm",
  owner: "fail",
  latitude: -22,
  longitude: -44,
  city: "São Paulo",
  timezone: "America/Sao Paulo",
};

export const createFarmFuncMock = async (
  user: UserModel & { token: string },
  data?: CreateFarmDto
) => {
  const response = await request(server.getApp())
    .post("/farms")
    .set("Authorization", user?.token)
    .send(data ?? { ...createFarmDataMock, owner: user?.id });

  return response.body as FarmModel;
};

export const addUserIntoFarmMock = async (
  user: UserModel & { token: string },
  farm_id: string,
  userData?: Omit<CreateUserDto, "user_type">
) => {
  await request(server.getApp())
    .put(`/farms/${farm_id}`)
    .set("Authorization", user?.token)
    .send({
      type: "ADD_WORKER",
      id: farm_id,
      ...userData,
    });
};
