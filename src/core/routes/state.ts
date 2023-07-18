import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const stateRoutes = () =>
  express
    .Router()
    .get(
      "/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.CHECK_ALL_STATUS)
        .handle
    )
    .post(
      "/",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.ACTION).handle
    )
    .get(
      "/:id/:start/:end",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.GET_HISTORY).handle
    );
