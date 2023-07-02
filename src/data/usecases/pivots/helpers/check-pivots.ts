import { IBaseRepository } from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export const checkPivotExist = async (
  pivot_id: string,
  exists: boolean = true
): Promise<PivotModel> => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  const pivot = await baseRepo.findOne<PivotModel>(DB_TABLES.PIVOTS, {
    pivot_id,
  });

  if (exists && !pivot) throw new Error("Pivô não encontrada");
  if (!exists && pivot) throw new Error("Pivô já existe");

  return pivot;
};
