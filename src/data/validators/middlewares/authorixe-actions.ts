import { IAppLog } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import express from "express";
import jwt from "jsonwebtoken";

interface TokenInfo {
  user_id: string;
  login: string;
  user_type: string;
}

export const authorizeUserForActionMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
    const token = req.headers.authorization;

    if (!token) {
      console.error("No token provided");
      return res.status(401).send("No token provided");
    }

    const decode = <TokenInfo>(
      jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret)
    );

    if (!decode) {
      console.error("Nenhum dado encontrado ao decriptografar dados ");
      return res.status(401).send("Internal Server Error");
    }

    console.log(decode?.user_type);
    if (decode?.user_type !== "SUDO") {
      console.error("Usuário não tem acesso para ação");
      return res.status(401).send("Usuário não tem acesso para ação");
    }

    next();
  } catch (err) {
    console.warn("Erro encontrado ao checar autorização de usuário");
    console.error(err.message);
    res.status(401).send(err.message);
  }
};
