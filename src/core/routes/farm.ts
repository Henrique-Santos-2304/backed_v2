import { authorizeUserForActionMiddleware } from "@root/data/validators/middlewares";
import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const farmRoutes = () =>
  express
    .Router()
    .post(
      "/",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.CREATE).handle
    )
    .post(
      "/addUserIntoFarm",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.ADD_USER).handle
    )
    .put(
      "/:id",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.PUT).handle
    )
    .delete(
      "/:id",
      authMiddleware,
      authorizeUserForActionMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.DELETE).handle
    )
    .get(
      "/readAll",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.GET_ALL).handle
    )
    .get(
      "/dealers/:id",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.GET_BY_DEALER)
        .handle
    )
    .get(
      "/farmUser/:id",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.GET_BY_USER).handle
    )
    .get(
      "/getOneFarm/:id",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.GET_ONE).handle
    )
    .get(
      "/usersOfFarms/:id",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.GET_USERS).handle
    );
