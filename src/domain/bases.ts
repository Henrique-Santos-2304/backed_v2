import { NextFunction, Request, Response } from "express";
import { DbTables } from "./repos";

export type IIsGateway = { isGateway: boolean };

export interface IBaseUseCases<P = any, R = any> {
  execute(params: P): Promise<R>;
}

export interface IBaseController<R = any> {
  handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<R>>;
}

export interface IBaseRepository {
  create<P = any>(model: DbTables, data: P): Promise<P>;
  delete<P = any>(model: DbTables, where: Partial<P>): Promise<void>;
  deleteAll<P = any>(model: DbTables, where?: Partial<P>): Promise<void>;
  findOne<P = any>(model: DbTables, where: Partial<P>): Promise<P>;
  findLast<P = any>(model: DbTables, where: Partial<P>): Promise<P>;
  findAll<P = any>(model: DbTables): Promise<P[]>;
  findAllByData<P = any>(model: DbTables, where: Partial<P>): Promise<P[]>;
  update<P = any>(
    model: DbTables,
    where: Partial<P>,
    data: Partial<P>
  ): Promise<P>;
}
