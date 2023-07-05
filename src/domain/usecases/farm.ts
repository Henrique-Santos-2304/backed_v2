import { FarmModel, UserModel } from "@db/models";
import { CreateFarmDto, CreateUserDto } from "@db/dto";
import { IBaseUseCases } from "../bases";

export type IAddUserFarmType = { user_id: string; farm_id: string };
export type OptionsPutFarm = {
  type: "ADD_WORKER" | "REMOVE_WORKER" | "FULL";
};
export type PutFarmFull = FarmModel & OptionsPutFarm;

export type PutFarmAddUser = Omit<CreateUserDto, "user_type"> & {
  id: string;
} & OptionsPutFarm;

export type PutFarmDelUser = { id: string; worker: string } & OptionsPutFarm;

export type ICreateFarmExecute = IBaseUseCases<
  CreateFarmDto,
  FarmModel
>["execute"];

export type IAddUserToFarmExecute = IBaseUseCases<
  PutFarmAddUser & { isGateway?: boolean },
  FarmModel
>["execute"];

export type IDelUserToFarmExecute = IBaseUseCases<
  PutFarmDelUser & { isGateway?: boolean },
  FarmModel
>["execute"];

export type IDelFarmExecute = IBaseUseCases<string, void>["execute"];
export type IGetOneFarmExecute = IBaseUseCases<string, FarmModel>["execute"];
export type IGetAllFarmExecute = IBaseUseCases<void, FarmModel>["execute"];
export type IPutFarmExecute = IBaseUseCases<
  {
    farm: PutFarmAddUser | PutFarmAddUser | PutFarmDelUser;
    farm_id: string;
    isGateway?: boolean;
  },
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
