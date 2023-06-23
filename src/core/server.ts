import { createServer } from "http";
import timeout from "connect-timeout";
import cors from "cors";
import express, { Express } from "express";

import knex from "./db";
import { expressRouters } from "./main-route";

import { IAppLog, IAppServer, IIotConnect } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import {
  injectCommons,
  injectRepos,
  injectControllers,
  injectUseCases,
  injectObservables,
} from "@main/composers";

export class AppServer implements IAppServer {
  #app: Express;
  #httpServer: any;

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
    this.#httpServer.listen(3308, async () => {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
        `-----Bem vindo a SOIL-----\n`
      );

      Injector.get<IIotConnect>(INJECTOR_COMMONS.IOT_CONFIG)?.start();
      await knex.migrate.latest({});
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
