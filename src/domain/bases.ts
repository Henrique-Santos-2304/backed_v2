import { NextFunction, Request, Response } from "express";
import {
  IQueryCreateBase,
  IQueryDeleteBase,
  IQueryDeleteALLBase,
  IQueryFindBase,
  IQueryFindAllBase,
  IQueryUpdateBase,
} from "./repos";

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
  create<P, R = any>({ column, data }: IQueryCreateBase<P>): Promise<R>;
  delete({ column, where }: IQueryDeleteBase): Promise<void>;
  deleteAll({ column }: IQueryDeleteALLBase): Promise<void>;
  deleteByDate({
    column,
    where,
    start,
    end,
  }: IQueryDeleteBase & { start: Date; end: Date }): Promise<void>;
  findOne<R = any>({ column, where }: IQueryFindBase): Promise<R>;
  findLast<R = any>({ column, where }: IQueryFindBase): Promise<R>;
  findAll<R = any>({ column }: IQueryFindAllBase): Promise<R[]>;
  findAllByData<R = any>({ column, where }: IQueryFindBase): Promise<R[]>;
  update<P, R = any>({ column, data, where }: IQueryUpdateBase<P>): Promise<R>;
}
