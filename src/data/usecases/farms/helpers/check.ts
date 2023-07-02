import { IBaseRepository } from "@root/domain";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export const checkFarmExist = async (
  farm_id: string,
  exists: boolean = true
): Promise<FarmModel> => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  const farm = await baseRepo.findOne<FarmModel>(DB_TABLES.FARMS, { farm_id });

  if (exists && !farm) throw new Error("Fazenda não encontrada");
  if (!exists && farm) throw new Error("Fazenda já existe");

  return farm;
};
