import { server } from "@root/app";
import { CreateUserDto } from "@root/infra";
import { UserModel } from "@root/infra/models";
import request from "supertest";

export const createUserDataMock = {
  username: "soil",
  password: "1234",
  user_type: "SUDO",
};

export const createUserFuncMock = async (data?: CreateUserDto) => {
  await request(server.getApp())
    .post("/users")
    .send(data ?? createUserDataMock);

  const response = await request(server.getApp())
    .post("/users/auth")
    .send({
      username: data?.username ?? createUserDataMock?.username,
      password: data?.password ?? createUserDataMock?.password,
    });

  return response.body as UserModel & { token: string };
};
