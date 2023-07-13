import {
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  splitMsgCloud,
} from "@root/shared";
import { Injector } from "@root/main/injector";
import { IAppLog, IIotConnect } from "@root/domain";

export class NewCloudMessages {
  static formatMessage(listLen: number, len: number) {
    if (listLen !== len) {
      const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
      console.warn("Erro ao manipular mensagem recebida");
      console.error("Formato Inválido");
      return true;
    }
  }

  static async start(message: ArrayBuffer) {
    const { toList, idp } = splitMsgCloud(message.toString());

    if (idp === IDPS.GET_INITIAL_DATA) {
      if (NewCloudMessages.formatMessage(toList.length, 2)) return;

      return await Injector.get(
        INJECTOR_CASES.COMMONS.GET_INITIAL_DATA
      )?.execute(toList[1]);
    }

    if (idp === IDPS.STATUS) {
      const iot = Injector.get<IIotConnect>(INJECTOR_COMMONS.IOT_CONFIG);
      await iot.publisher(toList[1], `#${IDPS.CHECK_CONNECTION}-${toList[1]}$`);

      if (NewCloudMessages.formatMessage(toList.length, 7)) return;
      // Init actions status
      return await Injector.get(
        INJECTOR_CASES.COMMONS.RECEIVED_STATUS
      )?.execute(toList);
    }

    if (idp === IDPS.CHECK_CONNECTION) {
      if (NewCloudMessages.formatMessage(toList.length, 2)) return;

      return await Injector.get<IIotConnect>(
        INJECTOR_COMMONS.IOT_CONFIG
      )?.publisher(toList[1], message.toString());
    }
  }
}
