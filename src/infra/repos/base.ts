import { DbTables } from "@contracts/repos";
import { IBaseRepository } from "@contracts/bases";
import { repositoryAdapter } from "@main/adapters";
import { prisma } from "@root/core";
import { DB_TABLES } from "@root/shared";

type ObjectDinamic<T = any> = { [key: string]: T };
type Options = {
  findFirst: (query: any) => Promise<any>;
  findMany: (query?: any) => Promise<any>;
  update: (query: any) => Promise<any>;
  delete: (query: any) => Promise<any>;
  deleteMany: (query?: any) => Promise<any>;
  create: (params: any) => Promise<any>;
};

export class BaseRepository implements IBaseRepository {
  #prisma: ObjectDinamic<Options> = {};

  constructor() {
    (this.#prisma[DB_TABLES.USERS] = prisma.user),
      (this.#prisma[DB_TABLES.FARMS] = prisma.farm),
      (this.#prisma[DB_TABLES.PIVOTS] = prisma.pivot),
      (this.#prisma[DB_TABLES.STATES] = prisma.state),
      (this.#prisma[DB_TABLES.STATE_VARIABLES] = prisma.stateVariable),
      (this.#prisma[DB_TABLES.CYCLES] = prisma.cycle),
      (this.#prisma[DB_TABLES.CONNECTIONS] = prisma.connection);
  }

  async create<P = any>(model: DbTables, data: P): Promise<P> {
    const callback = async () =>
      await this.#prisma[model]?.create({
        data,
      });

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P>;
  }

  async delete<P = any>(model: DbTables, where: Partial<P>): Promise<void> {
    const callback = async () =>
      await this.#prisma[model]?.delete({
        where,
      });

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<void>;
  }

  async deleteAll<P = any>(model: DbTables, where?: Partial<P>): Promise<void> {
    const callback = async () => await this.#prisma[model]?.deleteMany(where);

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<void>;
  }

  async findOne<P = any>(model: DbTables, where: Partial<P>): Promise<P> {
    const callback = async () => {
      const res = await this.#prisma[model]?.findFirst({
        where,
      });

      return res;
    };

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P>;
  }

  async findLast<P = any>(model: DbTables, where: Partial<P>): Promise<P> {
    const callback = async () => {
      const response = await this.#prisma[model]?.findMany({
        where,
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      });
      return response[0];
    };

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P>;
  }

  async findAll<P = any>(model: DbTables): Promise<P[]> {
    const callback = async () => await this.#prisma[model]?.findMany();

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P[]>;
  }

  async findAllByData<P = any>(
    model: DbTables,
    where: Partial<P>
  ): Promise<P[]> {
    const callback = async () => await this.#prisma[model]?.findMany({ where });

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P[]>;
  }

  async update<P = any>(
    model: DbTables,
    where: Partial<P>,
    data: Partial<P>
  ): Promise<P> {
    const callback = async () =>
      await this.#prisma[model]?.update({ where, data });

    return (await repositoryAdapter({
      columnName: model,
      callback,
    })) as Promise<P>;
  }
}
