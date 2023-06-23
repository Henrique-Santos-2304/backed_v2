import { PivotModel, StateModel, StateVariableModel } from "@db/models";
import { CreatePivotDto } from "@db/dto";
import { IBaseUseCases, IIsGateway } from "../bases";

export type GetPivotFullResponse = {
  pivot: PivotModel & { last_state_timestamp: string };
  state: Pick<StateModel, "power" | "water" | "direction" | "connection">;
  variable: Pick<StateVariableModel, "percentimeter" | "angle">;
  timestamp: string;
};

export type ICreatePivotExecute = IBaseUseCases<
  { pivot: CreatePivotDto } & IIsGateway,
  PivotModel
>["execute"];

export type IPutPivotExecute = IBaseUseCases<
  { pivot: PivotModel } & IIsGateway,
  PivotModel
>["execute"];

export type IStateReceivedPivotExecute = IBaseUseCases<
  { payload: string } & IIsGateway,
  void
>["execute"];

export type IDelPivotExecute = IBaseUseCases<
  { pivot_id: string } & IIsGateway,
  void
>["execute"];
export type IGetOnePivot = IBaseUseCases<string, PivotModel>["execute"];

export type IGetPivotFull = IBaseUseCases<
  string,
  GetPivotFullResponse
>["execute"];
export type IGetAllPivotFull = IBaseUseCases<
  string,
  GetPivotFullResponse[]
>["execute"];
