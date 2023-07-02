import { IBaseRepository } from "@root/domain";
import { StateVariableModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export const getLastStateVariable = async (state_id: string) => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  return await baseRepo.findLast<StateVariableModel>(
    DB_TABLES.STATE_VARIABLES,
    { state_id }
  );
};
