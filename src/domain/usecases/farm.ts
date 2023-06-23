import { FarmModel, UserModel } from "@db/models";
import { CreateFarmDto } from "@db/dto";
import { IBaseUseCases } from "../bases";

export type IAddUserFarmType = { user_id: string; farm_id: string };

export type ICreateFarmExecute = IBaseUseCases<
  CreateFarmDto,
  FarmModel
>["execute"];

export type IAddUserToFarmExecute = IBaseUseCases<
  IAddUserFarmType & { isGateway?: boolean },
  FarmModel
>["execute"];

export type IDelFarmExecute = IBaseUseCases<string, void>["execute"];
export type IGetOneFarmExecute = IBaseUseCases<string, FarmModel>["execute"];
export type IGetAllFarmExecute = IBaseUseCases<void, FarmModel>["execute"];
export type IPutFarmExecute = IBaseUseCases<
  { farm: FarmModel; isGateway?: boolean },
  FarmModel
>["execute"];
export type IUsersOfFarmExecute = IBaseUseCases<
  string,
  Omit<UserModel, "password" | "secret">[]
>["execute"];

export type IGetByDealerFarmExecute = IBaseUseCases<
  string,
  FarmModel[]
>["execute"];
export type IGetByUserFarmExecute = IBaseUseCases<
  string,
  FarmModel[]
>["execute"];
