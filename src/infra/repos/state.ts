import { repositoryAdapter } from "@main/adapters";
import { DB_TABLES } from "@shared/constants";
import { prisma } from "@root/core";

import { CycleResponseType, IStateRepo } from "@root/domain/repos";

export class StateRepo implements IStateRepo {
  async getCycles(
    pivot_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<CycleResponseType[]> {
    const callback = async () => {
      return prisma.state.findMany({
        where: {
          pivot_id,
          start_date: {
            gte: start_date,
          },
          OR: [
            {
              end_date: {
                lte: end_date,
              },
            },
            { is_off: false },
          ],
        },
        include: {
          cycles: true,
          variables: true,
        },
        orderBy: {
          start_date: "desc",
        },
      });
    };

    return await repositoryAdapter({
      columnName: DB_TABLES.PIVOTS,
      callback,
    });
  }
}
