import { IBaseRepository } from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export const checkPivotExist = async (
  repo: IBaseRepository["findOne"],
  pivot_id: string,
  exists: boolean = true
): Promise<PivotModel> => {
  return await checkDataExists<PivotModel>(
    repo,
    {
      column: DB_TABLES.PIVOTS,
      where: "pivot_id",
      equals: pivot_id,
    },
    "Pivôs",
    exists
  );
};
