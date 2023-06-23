import knex from "@core/db";
import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import { GetLastStatePivot, IPivotRepo } from "@contracts/repos";
import { PivotModel } from "../models";

export class PivotRepo implements IPivotRepo {
  async getLastState(pivot_id: string): Promise<GetLastStatePivot> {
    const callback = async () => {
      return await knex<PivotModel>(DB_TABLES.PIVOTS)
        .select("last_state", "last_angle", "last_timestamp")
        .where({ pivot_id })
        .first();
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<GetLastStatePivot>;
  }
}
