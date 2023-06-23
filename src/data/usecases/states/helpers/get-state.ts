import { IBaseRepository } from "@root/domain";
import { StateModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";

export const getLastStateFull = async (
  repo: IBaseRepository["findLast"],
  pivot_id: string
) => {
  return await repo<StateModel>({
    column: DB_TABLES.STATES,
    where: "pivot_id",
    equals: pivot_id,
  });
};
