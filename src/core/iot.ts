import { IIotConnect } from "@root/domain";
import { console } from "@composer/index";
import { device as Device } from "aws-iot-device-sdk";

export class IotConfig implements IIotConnect {
  #connection: Device;

  #topics: string[] = [];

  constructor() {}

  private __init__() {
    try {
      this.#topics = process.env.TOPICS?.split(", ");
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
    if (!this.#connection) this.__init__();
    console.warn("Conectando ao AWS Iot Core...");
    this.#connection?.on("connect", () => {
      console.warn(`Conexão efetuada com sucesso!   \n`);
      this.#connection?.subscribe(this.#topics, {
        qos: 0,
      });
    });

    this.#connection?.on(
      "message",
      async (topic: string, payload: ArrayBuffer) => {
        console.log(`Nova mensagem recebida no tópico ${topic}`);
        console.log(`${payload.toString()}\n`);
      }
    );

    this.#connection?.on("close", () => {
      console.warn("AWS -> Conexão fechada ");
    });

    this.#connection?.on("offline", () => {
      console.warn("AWS está offline ");
    });

    this.#connection?.on("error", (error: Error) => {
      console.warn(`AWS ERRO!!`);
      console.error(error.message);
    });

    this.#connection?.on("reconnect", async () => {
      console.warn("AWS Reconectando....");
    });
  }

  async publisher(topic: string, message: string) {
    try {
      this.#connection?.publish(topic, message);
      console.log(
        `${new Date().toString()} Mensagem publicado com sucesso para o tópico ${topic}`
      );
    } catch (err) {
      console.warn(`Erro ao publicar mensagem no tópico topic ${topic}`);
      console.error(err.message);
    }
  }
}
