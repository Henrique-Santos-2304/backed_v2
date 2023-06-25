import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const schedulingsRoutes = () =>
  express
    .Router()
    .post(
      "/",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.SCHEDULE.CREATE).handle
    )
    .delete(
      "/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.SCHEDULE.DELETE).handle
    )
    .put(
      "/",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.SCHEDULE.UPDATE).handle
    )
    .get(
      "/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.SCHEDULE.GET_ALL_BY_DATE)
        .handle
    )
    .get(
      "/angle/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.SCHEDULE.GET_ALL_BY_ANGLE)
        .handle
    );
