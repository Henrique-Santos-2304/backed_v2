import { NextFunction, Response } from "express";

type Params<R> = {
  response: Response;
  next?: NextFunction;
  callback: () => Promise<R>;
};

export type ControllerAdapterType<R = any> = ({
  response,
  callback,
  next,
}: Params<R>) => Promise<R>;
