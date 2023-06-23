import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const cyclesRoutes = () =>
  express
    .Router()
    .get(
      "/:id/:start/:end",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.GET_HISTORY).handle
    );
