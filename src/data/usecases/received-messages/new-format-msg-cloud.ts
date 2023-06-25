import { IDPS, INJECTOR_CASES, splitMsgCloud } from "@root/shared";
import { Injector } from "@root/main/injector";

export class NewCloudMessages {
  static async start(message: ArrayBuffer) {
    const { toList } = splitMsgCloud(message.toString());

    switch (toList[0]) {
      case IDPS.GET_INITIAL_DATA:
        Injector.get(INJECTOR_CASES.COMMONS.GET_INITIAL_DATA)?.execute(
          toList[1]
        );
        break;
      case IDPS.STATUS:
        if (toList.length !== 6) throw new Error("Formato Inválido");
        Injector.get(INJECTOR_CASES.COMMONS.RECEIVED_STATUS)?.execute(toList);
        break;

      default:
        break;
    }
  }
}
