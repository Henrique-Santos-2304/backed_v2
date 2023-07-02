import { INJECTOR_CASES, INJECTOR_COMMONS } from "@root/shared";
import { Injector } from "@root/main/injector";
import { CloudMqttRemotePayloadType } from "@root/domain";

export class OldCloudMessages {
  static async sendAction(message: CloudMqttRemotePayloadType) {
    if (!message?.payload || message.payload === "000-000") return;

    Injector.get(INJECTOR_CASES.COMMONS.RECEIVED_STATUS)?.execute([
      0,
      message.id,
      ...message.payload.split("-"),
    ]);
  }

  static async handleMessageType(message: any) {
    if (message.type === "status") {
      await this.sendAction(message as CloudMqttRemotePayloadType);
    } else if (message.type === "action") {
      Injector.get(INJECTOR_COMMONS.APP_LOGS).log("Ack de ação recebido");
    }
  }

  static async start(message: ArrayBuffer) {
    const decoder = new TextDecoder("utf8", { fatal: false });
    const json = JSON.parse(decoder.decode(message));

    const payload = json.payload.replace("#", "").replace("$", "").trim();
    await OldCloudMessages.handleMessageType({ ...json, payload });

    return;
  }
}
