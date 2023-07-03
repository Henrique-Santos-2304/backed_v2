import { Server } from "http";
import { Express } from "express";

export interface IAppServer {
  start(): void;
  getApp(): Express;
  getHttpServer(): Server;
}

export interface ISocketServer {
  start(server: Server): void;
  publisher(topic: string, message: any): void;
}
