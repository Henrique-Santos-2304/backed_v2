import { authorizeUserForActionMiddleware } from "@root/data/validators/middlewares";
import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const pivotRoutes = () =>
  express
    .Router()
    .post(
      "/",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.PIVOTS.CREATE).handle
    )
    .put(
      "/",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.PIVOTS.PUT).handle
    )
    .delete(
      "/:id",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.PIVOTS.DELETE).handle
    )
    .get(
      "/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.PIVOTS.GET_ALL).handle
    )
    .get(
      "/by_id/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.PIVOTS.GET_ONE).handle
    );
