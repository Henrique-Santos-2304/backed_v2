import knex from "@core/db";

import {
  IQueryCreateBase,
  IQueryDeleteBase,
  IQueryDeleteALLBase,
  IQueryFindBase,
  IQueryFindAllBase,
  IQueryUpdateBase,
  DbTables,
  QueryWhereCondition,
} from "@contracts/repos";
import { IBaseRepository } from "@contracts/bases";
import { repositoryAdapter } from "@main/adapters";
import { RepositoryAdapterParams } from "@contracts/main";

export class BaseRepository implements IBaseRepository {
  async create<P, R = any>({ column, data }: IQueryCreateBase<P>): Promise<R> {
    const callback: RepositoryAdapterParams<R>["callback"] = async () => {
      const res = await knex(column).insert(data).select("*").returning("*");
      return res[0];
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R>;
  }

  async delete({ column, where, equals }: IQueryDeleteBase): Promise<void> {
    const callback: RepositoryAdapterParams["callback"] = async () => {
      await knex(column).where(where, equals).delete();
    };

    (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<void>;
  }

  async deleteByDate({
    column,
    where,
    equals,
    start,
    end,
  }: IQueryDeleteBase & { start: Date; end: Date }): Promise<void> {
    const callback: RepositoryAdapterParams["callback"] = async () => {
      await knex(column)
        .where(where, equals)
        .where("timestamp", ">", "start")
        .where("timestamp", "<=", "end")
        .delete();
    };

    (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<void>;
  }

  async deleteAll({ column }: IQueryDeleteALLBase): Promise<void> {
    const callback: RepositoryAdapterParams["callback"] = async () => {
      await knex(column).delete();
    };
    (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<void>;
  }

  async findOne<R = any>({
    column,
    where,
    equals,
  }: IQueryFindBase): Promise<R> {
    const callback: RepositoryAdapterParams<R>["callback"] = async () => {
      return await knex(column).where(where, equals).select("*").first();
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R>;
  }

  async findLast<R = any>({
    column,
    where,
    equals,
  }: IQueryFindBase): Promise<R> {
    const callback: RepositoryAdapterParams<R>["callback"] = async () => {
      return await knex(column)
        .where(where, equals)
        .select("*")
        .orderBy("timestamp", "desc")
        .first();
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R>;
  }

  async findAll<R = any>({ column }: IQueryFindAllBase): Promise<R[]> {
    const callback: RepositoryAdapterParams<R[]>["callback"] = async () => {
      return await knex(column).select("*");
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R[]>;
  }

  async findAllByData<R = any>({
    column,
    where,
    equals,
  }: IQueryFindBase): Promise<R[]> {
    const callback: RepositoryAdapterParams<R[]>["callback"] = async () => {
      return await knex(column).where(where, equals).select("*");
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R[]>;
  }

  async update<P, R = any>({
    column,
    where,
    equals,
    data,
  }: IQueryUpdateBase<P>): Promise<R> {
    const callback: RepositoryAdapterParams<R[]>["callback"] = async () => {
      const res = await knex(column)
        .where(where, equals)
        .update(data)
        .select("*")
        .returning("*");

      return res[0];
    };
    return (await repositoryAdapter({
      columnName: column,
      callback,
    })) as Promise<R>;
  }
}
