import knex from "@core/db";
import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import { StateVariableModel } from "../models";
import {
  GetVariableGroupByResponse,
  IStateVariableRepo,
} from "@root/domain/repos";

export class StateVariablesRepo implements IStateVariableRepo {
  async getVariableGroupBy(
    state_id: string
  ): Promise<GetVariableGroupByResponse[]> {
    const callback = async () => {
      return await knex<StateVariableModel>(DB_TABLES.STATE_VARIABLES)
        .select("percentimeter", "timestamp", "angle")
        .where("state_id", state_id)
        .groupBy("angle", "percentimeter", "timestamp")
        .orderBy("timestamp", "cresc");
    };
    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<GetVariableGroupByResponse[]>;
  }
}
