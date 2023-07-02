import { IBaseRepository } from "@root/domain";
import { StateModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export const getLastStateFull = async (pivot_id: string) => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  return await baseRepo.findLast<StateModel>(DB_TABLES.STATES, { pivot_id });
};
