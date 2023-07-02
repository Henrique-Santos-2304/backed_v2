import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";

import { SchedulingModel } from "../models";
import { ISchedulingRepo } from "@root/domain/repos";
import { prisma } from "@root/core";

export class SchedulingRepo implements ISchedulingRepo {
  async dates(pivot_id: string): Promise<SchedulingModel[]> {
    const callback = async () => {
      return [] as SchedulingModel[];
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<SchedulingModel[]>;
  }

  async angles(pivot_id: string): Promise<SchedulingModel[]> {
    const callback = async () => {
      return [] as SchedulingModel[];
    };

    return (await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    })) as Promise<SchedulingModel[]>;
  }
}
