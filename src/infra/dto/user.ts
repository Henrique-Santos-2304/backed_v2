import { UserModel } from "../models";

export class CreateUserDto {
  login: UserModel["login"];
  password: UserModel["password"];
  user_type: UserModel["user_type"];
}
