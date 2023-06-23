import { IBaseRepository } from "@root/domain";
import { FarmModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export const checkFarmExist = async (
  repo: IBaseRepository["findOne"],
  farm_id: string,
  exists: boolean = true
): Promise<FarmModel> => {
  return await checkDataExists<FarmModel>(
    repo,
    {
      column: DB_TABLES.FARMS,
      where: "farm_id",
      equals: farm_id,
    },
    "Fazenda",
    exists
  );
};
