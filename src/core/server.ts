import { Server, createServer } from "http";
import cors from "cors";
import express, { Express } from "express";

import { expressRouters } from "./main-route";

import { IAppLog, IAppServer, IIotConnect, ISocketServer } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import {
  injectCommons,
  injectRepos,
  injectControllers,
  injectUseCases,
  injectObservables,
} from "@main/composers";
import { prisma } from "./db";

export class AppServer implements IAppServer {
  #app: Express;
  #httpServer: Server;

  constructor() {
    this.#app = express();
    this.#httpServer = createServer(this.#app);
  }

  private async instanceDependencies() {
    await injectRepos();
    await injectCommons();
    await injectObservables();
    await injectUseCases();
    await injectControllers();
  }

  private config() {
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(expressRouters());
  }

  private init() {
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
      `-----Bem vindo a SOIL-----\n`
    );

    Injector.get<ISocketServer>(INJECTOR_COMMONS.SOCKET).start(
      this.#httpServer
    );
    this.#httpServer.listen(3308, async () => {
      //Injector.get<IIotConnect>(INJECTOR_COMMONS.IOT_CONFIG)?.start();
    });
  }

  start(): void {
    this.instanceDependencies()
      .then((_) => {
        this.config();
        this.init();
      })
      .catch((error) => {
        console.log("ERRO! Erro ao iniciar instancias");
        console.error(error.message);
      });
  }

  getApp = () => this.#app;

  getHttpServer = () => this.#httpServer;
}
