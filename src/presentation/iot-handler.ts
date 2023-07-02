import {
  NewCloudMessages,
  OldCloudMessages,
  ReceivedGatewayMessages,
  SchedulingMessages,
} from "@root/data";
import { IHandlerMessageIot } from "@root/domain";

export class IotHandlerMessage implements IHandlerMessageIot {
  async handler(topic: string, message: ArrayBuffer) {
    try {
      if (topic === process.env.AWS_CLOUD) {
        return await OldCloudMessages.start(message);
      }

      if (topic === process.env.NEW_AWS_CLOUD) {
        return await NewCloudMessages.start(message);
      }

      if (topic === process.env.GATEWAY_MESSAGES) {
        return await ReceivedGatewayMessages.start(message);
      }

      if (topic === process.env.AWS_SCHEDULING) {
        return await SchedulingMessages.start(message);
      }
    } catch (error) {
      console.warn("Erro ao processar mensagem recebida");
      console.error(`${error.message}\n`);
    }
  }
}
