import knex from "@core/db";
import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import { SchedulingModel } from "../models";
import { ISchedulingRepo } from "@root/domain/repos";

export class SchedulingRepo implements ISchedulingRepo {
  async dates(pivot_id: string): Promise<SchedulingModel[]> {
    const callback = async () => {
      return await knex(DB_TABLES.SCHEDULINGS)
        .select("*")
        .where({ pivot_id, status: "PENDING" })
        .where((query) => {
          query.where({ type: "STOP_DATE" }).orWhere({ type: "FULL_DATE" });
        });
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<SchedulingModel[]>;
  }

  async angles(pivot_id: string): Promise<SchedulingModel[]> {
    const callback = async () => {
      return await knex(DB_TABLES.SCHEDULINGS)
        .select("*")
        .where({ pivot_id, status: "PENDING" })
        .where((query) => {
          query.where({ type: "STOP_ANGLE" }).orWhere({ type: "FULL_ANGLE" });
        });
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<SchedulingModel[]>;
  }
}
