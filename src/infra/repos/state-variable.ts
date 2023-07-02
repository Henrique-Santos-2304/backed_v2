import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import {
  GetVariableGroupByResponse,
  IStateVariableRepo,
} from "@root/domain/repos";
import { prisma } from "@root/core";

export class StateVariablesRepo implements IStateVariableRepo {
  async getVariableGroupBy(
    state_id: string
  ): Promise<GetVariableGroupByResponse[]> {
    const callback = async () => {
      return prisma.stateVariable.groupBy({
        where: { state_id },
        by: ["angle", "percentimeter", "timestamp"],
        orderBy: { timestamp: "desc" },
      });
    };
    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<GetVariableGroupByResponse[]>;
  }
}
/* const callback = async () => {
  return await knex<StateVariableModel>(DB_TABLES.STATE_VARIABLES)
    .select("percentimeter", "timestamp", "angle")
    .where("state_id", state_id)
    .groupBy("angle", "percentimeter", "timestamp")
    .orderBy("timestamp", "cresc");
}; */
