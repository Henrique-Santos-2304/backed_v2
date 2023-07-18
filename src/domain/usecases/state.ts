import { StateModel } from "@root/infra/models";
import { IBaseUseCases, IIsGateway } from "../bases";
import { CycleResponseType } from "../repos";

type CyclePartial = Partial<CycleResponseType>;
export type IGetStateHistoryExec = IBaseUseCases<
  { pivot_id: string; start_date: string; end_date: string },
  CyclePartial[]
>["execute"];

export type ActionProps = {
  pivot_id: string;
  direction: string;
  power: boolean;
  water: boolean;
  percentimeter: boolean;
  author: string;
};

export type ICreateActionExecute = IBaseUseCases<
  { action: string } & IIsGateway,
  void
>["execute"];
