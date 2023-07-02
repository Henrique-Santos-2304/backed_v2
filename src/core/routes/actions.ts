import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const actionsRoutes = () =>
  express
    .Router()
    .post(
      "/readState",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.CHECK_ALL_STATUS)
        .handle
    )
    .post(
      "/create/:id",
      authMiddleware,
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.ACTION).handle
    );
