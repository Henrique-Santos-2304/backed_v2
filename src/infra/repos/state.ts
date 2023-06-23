import knex from "@core/db";
import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import { StateModel } from "../models";
import { IStateRepo } from "@root/domain/repos";

export class StateRepo implements IStateRepo {
  async getHistoryCycle(
    pivot_id: string,
    start: Date,
    end: Date
  ): Promise<StateModel[]> {
    const callback = async () => {
      return await knex(DB_TABLES.STATES)
        .select("*")
        .where({ pivot_id })
        .where("connection", true)
        .where("timestamp", ">=", start)
        .where("timestamp", "<=", end)
        .orderBy("timestamp", "asc");
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<StateModel[]>;
  }
}
