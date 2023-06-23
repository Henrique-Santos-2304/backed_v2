import { IDPS, INJECTOR_CASES } from "@root/shared";
import { catchDataMessage } from "./helpers/get-data-msg";
import { Injector } from "@root/main/injector";

export class NewCloudMessages {
  static async start(message: ArrayBuffer) {
    const { payload, idp } = catchDataMessage(message);
    const arrayMessage = payload.split("-");

    switch (idp) {
      case IDPS.GET_INITIAL_DATA:
        Injector.get(INJECTOR_CASES.COMMONS.GET_INITIAL_DATA)?.execute(
          arrayMessage[1]
        );
        break;
      case IDPS.STATUS:
        Injector.get(INJECTOR_CASES.COMMONS.RECEIVED_STATUS)?.execute(payload);
        break;

      default:
        break;
    }
  }
}
