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
      "/signup",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.CREATE).handle
    )
    .post(
      "/signin",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.AUTH).handle
    )
    .get(
      "/allUsers",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.GET_ALL).handle
    )
    .delete(
      "/delUser/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.DELETE).handle
    )
    .put(
      "/putUser",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.PUT).handle
    );
