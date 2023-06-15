import express, { Express } from "express";
import { createServer } from "http";
import timeout from "connect-timeout";
import cors from "cors";

import { IAppServer } from "@root/domain";
import { console, iotConnection } from "@composer/index";
import knex from "./db";
import { expressRouters } from "./main-route";

export class AppServer implements IAppServer {
  #app: Express;
  #httpServer: any;

  constructor() {
    this.#app = express();
    this.#httpServer = createServer(this.#app);
  }

  private config() {
    this.#app.use(timeout("8000"));
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(expressRouters);
  }

  private init() {
    this.#httpServer.listen(3308, async () => {
      console.warn(`-----Bem vindo a SOIL-----\n`);

      iotConnection.start();
      await knex.migrate.latest({});
      try {
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  start(): void {
    this.config();
    this.init();
  }

  getApp = () => this.#app;

  getHttpServer = () => this.#httpServer;
}
