import { CheckPivotsInterval } from "@root/data";
import { IAppLog, IHandlerMessageIot, IIotConnect } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import { device as Device } from "aws-iot-device-sdk";

export class IotConfig implements IIotConnect {
  #connection: Device;
  #console: IAppLog;
  #handlerMessage: IHandlerMessageIot;

  #topics: string[] = [
    process.env.AWS_CLOUD,
    process.env.NEW_AWS_CLOUD,
    process.env.AWS_SCHEDULING,
    process.env.GATEWAY_MESSAGES,
    process.env.GATEWAY_CRUD,
  ];

  private injectInstances() {
    this.#console = this.#console || Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#handlerMessage =
      this.#handlerMessage ||
      Injector.get(INJECTOR_COMMONS.IOT_HANDLER_MESSAGE);
  }

  private __init__() {
    try {
      this.#connection = new Device({
        keyPath: process.env.AWS_KEY_PATH!,
        certPath: process.env.AWS_CERT_PATH!,
        caPath: process.env.AWS_CA_PATH,
        host: process.env.AWS_MQTT_HOST,
        clientId: process.env.AWS_CLIENT_ID!,
      });
    } catch (error) {
      console.log("Erro ao configurar mqtt");
      console.error(error.message);
    }
  }

  start() {
    this.injectInstances();
    if (!this.#connection) this.__init__();
    this.#console.warn("Conectando ao AWS Iot Core...");

    this.#connection?.on("connect", () => {
      this.#console.warn(`AWS Conectada com sucesso!   \n`);
      CheckPivotsInterval.start();

      this.#connection?.subscribe(this.#topics, {
        qos: 0,
      });
    });

    this.#connection?.on(
      "message",
      async (topic: string, payload: ArrayBuffer) => {
        this.injectInstances();
        this.#console.log(`Nova mensagem recebida no tópico ${topic}`);
        this.#console.log(`${payload.toString()}\n`);

        const response = await this.#handlerMessage.handler(topic, payload);

        if (!response) return;

        await this.publisher(response?.topic, response?.message);
      }
    );

    this.#connection?.on("close", () => {
      this.#console.warn("AWS -> Conexão fechada ");
    });

    this.#connection?.on("offline", () => {
      this.#console.warn("AWS está offline ");
    });

    this.#connection?.on("error", (error: Error) => {
      this.#console.warn(`AWS ERRO!!`);
      this.#console.error(error.message);
    });

    this.#connection?.on("reconnect", async () => {
      this.#console.warn("AWS Reconectando....");
    });
  }

  async publisher(topic: string, message: any) {
    try {
      this.injectInstances();

      this.#connection?.publish(topic, message);
      this.#console?.log(
        `Mensagem publicado com sucesso para o tópico ${topic}`
      );
    } catch (err) {
      const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
      console?.warn(`Erro ao publicar mensagem no tópico topic ${topic}`);
      console?.error(err.message);
    }
  }
}
