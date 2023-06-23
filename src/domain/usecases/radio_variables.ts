import { IBaseUseCases } from "../bases";

export type ISendRadioVariableExec = IBaseUseCases<
  { pivot_id: string; type: string },
  void
>["execute"];
