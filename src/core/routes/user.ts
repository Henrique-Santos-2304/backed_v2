import { authorizeUserForActionMiddleware } from "@root/data/validators/middlewares";
import authMiddleware from "@root/data/validators/middlewares/auth";
import { IBaseController } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_CONTROLS } from "@root/shared";
import jwt from "jsonwebtoken";
import express from "express";

export const userRoutes = () =>
  express
    .Router()
    .post(
      "/",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.CREATE).handle
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
    )
    .post(
      "/auth",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.USERS.AUTH).handle
    )
    .get("/auth", authMiddleware, (req, res, next) => {
      try {
        const token = req.headers.authorization;
        const user = jwt.verify(token!, process.env.TOKEN_SECRET as jwt.Secret);
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json({
          error: error.message,
        });
      }
    });
