import { Injector } from "../injector";
import { IotConfig } from "@root/core/iot";

import { IotHandlerMessage } from "@presenters/index";
import { EncrypterData, HashId, TokenValidator } from "@root/data";
import { AppDate, AppLogs, INJECTOR_COMMONS } from "@root/shared";

export const injectCommons = async () => {
  Injector.add(new IotHandlerMessage(), INJECTOR_COMMONS.IOT_HANDLER_MESSAGE);
  Injector.add(new IotConfig(), INJECTOR_COMMONS.IOT_CONFIG);
  Injector.add(new AppDate(), INJECTOR_COMMONS.APP_DATE);
  Injector.add(new AppLogs(), INJECTOR_COMMONS.APP_LOGS);
  Injector.add(new TokenValidator(), INJECTOR_COMMONS.APP_TOKEN);
  Injector.add(new HashId(), INJECTOR_COMMONS.APP_HASH);
  Injector.add(new EncrypterData(), INJECTOR_COMMONS.APP_ENCRYPTER);
};
