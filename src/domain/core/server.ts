import { Server } from "http";

export interface IAppServer {
  start(): void;
  getHttpServer(): Server;
}

export interface ISocketServer {
  start(server: Server): void;
  publisher(topic: string, message: any): void;
}
