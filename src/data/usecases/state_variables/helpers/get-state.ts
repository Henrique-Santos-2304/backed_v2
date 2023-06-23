import { IBaseRepository } from "@root/domain";
import { StateVariableModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";

export const getLastStateVariable = async (
  repo: IBaseRepository["findLast"],
  state_id: string
) => {
  return await repo<StateVariableModel>({
    column: DB_TABLES.STATE_VARIABLES,
    where: "state_id",
    equals: state_id,
  });
};
