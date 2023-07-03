import { UserModel } from "@db/models";
import { CreateUserDto } from "@db/dto";
import { IBaseUseCases } from "../bases";

export type ICreateUserResponse = Omit<UserModel, "password" | "secret"> & {
  token: string;
};

export type ICreateUserExecute = IBaseUseCases<
  CreateUserDto,
  ICreateUserResponse
>["execute"];

export type IAuthUserExecute = IBaseUseCases<
  Pick<UserModel, "username" | "password">,
  Omit<ICreateUserResponse, "username">
>["execute"];

export type IDelUserExecute = IBaseUseCases<string, void>["execute"];

export type IPutUserExecute = IBaseUseCases<UserModel, UserModel>["execute"];
