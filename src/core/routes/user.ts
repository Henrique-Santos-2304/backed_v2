import { authorizeUserForActionMiddleware } from "@root/data/validators/middlewares";
import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const userRoutes = () =>
  express
    .Router()
    .post(
      "/",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.CREATE).handle
    )
    .post(
      "/auth",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.AUTH).handle
    )
    .get(
      "/",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.GET_ALL).handle
    )
    .delete(
      "/:id",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.DELETE).handle
    )
    .put(
      "/",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.PUT).handle
    );
