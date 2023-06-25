import { IDPS, INJECTOR_CASES, splitMsgCloud } from "@root/shared";
import { Injector } from "@root/main/injector";
import { IBaseUseCases } from "@root/domain";

export class ReceivedGatewayMessages {
  static IDP_VARIABLES = [
    IDPS.NOISE,
    IDPS.ROUTE,
    IDPS.RSSI,
    IDPS.ALL_VARIABLES,
  ];

  static async start(message: ArrayBuffer) {
    const { msg, idp } = splitMsgCloud(message.toString());

    const idpIsValid = ReceivedGatewayMessages.IDP_VARIABLES.includes(idp);

    if (!idpIsValid) return;

    const service = Injector.get<IBaseUseCases>(
      INJECTOR_CASES.RADIO_VARIABLES.SAVE
    );

    return await service.execute(msg);
  }
}
