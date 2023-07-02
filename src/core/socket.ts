import { IAppLog, ISocketServer } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";

export class SocketConnect implements ISocketServer {
  #console: IAppLog;
  #httpServer: Server;
  #io: SocketServer;
  #socketEmitter: Socket;

  private initInstances(server: Server) {
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#httpServer = server;
  }

  private config() {
    this.#console.warn("Conectando ao Socket...");

    this.#io = new SocketServer(this.#httpServer, {
      cors: { origin: "*", credentials: false },
    });

    this.#console.warn("Socket conectado com sucesso");

    this.#io.on("connect", (socket) => {
      this.#socketEmitter = socket;
    });
  }

  publisher(topic: string, payload: any) {
    try {
      if (!this.#socketEmitter) return;

      this.#socketEmitter.emit(topic, payload);
    } catch (error) {
      this.#console.warn("Erro ao enviar dados via socket");
      this.#console.error(error.message);
    }
  }

  start(server: Server) {
    this.initInstances(server);
    this.config();
  }
}
