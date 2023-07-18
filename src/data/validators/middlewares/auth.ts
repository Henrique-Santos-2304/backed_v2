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

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);

    const token = req.headers.authorization;
    if (!token) {
      console.error("Nenhum token encontrado");
      return res.status(401).send("Unauthorized");
    }
    const decode = <TokenInfo>(
      jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret)
    );

    if (!decode) {
      console.error("Token Inválido");
      return res.status(401).send("Unauthorized");
    }
    next();
  } catch (err) {
    console.warn("Erro ao checar autenticidade de usuário");
    console.error(err.message);
    res.status(401).send("Invalid Token!");
  }
};

export default authMiddleware;
