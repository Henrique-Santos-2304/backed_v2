import { authorizeUserForActionMiddleware } from "@root/data/validators/middlewares";
import authMiddleware from "@root/data/validators/middlewares/auth";
import {
  allUserController,
  authUserController,
  createUserController,
  delUserController,
  putUserController,
} from "@root/main/composers";
import express from "express";

export const userRoutes = express
  .Router()
  .post("/signup", createUserController.handle)
  .post("/signin", authUserController.handle)
  .get("/allUsers", authMiddleware, allUserController.handle)
  .delete("/delUser/:id", authMiddleware, delUserController.handle)
  .put(
    "/putUser",
    authMiddleware,
    authorizeUserForActionMiddleware,
    putUserController.handle
  );
