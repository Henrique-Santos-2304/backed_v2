import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const radioVariablesRoutes = () =>
  express
    .Router()
    .post(
      "/",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.RADIO_VARIABLES.SEND)
        .handle
    );
