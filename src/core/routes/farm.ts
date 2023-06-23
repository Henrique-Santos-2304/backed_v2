import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import express from "express";

export const farmRoutes = () =>
  express
    .Router()
    .post(
      "/addFarm",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.CREATE).handle
    )
    .post(
      "/addUserIntoFarm",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.ADD_USER).handle
    )
    .put(
      "/updateFarm",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.FARMS.PUT).handle
    )
    .delete(
      "/deleteFarm/:id",
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
