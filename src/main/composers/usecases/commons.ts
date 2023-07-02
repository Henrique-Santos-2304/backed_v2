import { ReceveidStatus } from "@root/data/usecases/received-messages/status";
import { Injector } from "@root/main/injector";
import { GetInitialDataGateway } from "@root/data/usecases";
import { INJECTOR_CASES } from "@root/shared";
import { ScheduleManager, SendMessagesSignal } from "@root/data";

export const injectCommonsCases = async () => {
  Injector.add(
    new SendMessagesSignal(),
    INJECTOR_CASES.COMMONS.SEND_MESSAGES_SIGNAL
  );
  Injector.add(new ReceveidStatus(), INJECTOR_CASES.COMMONS.RECEIVED_STATUS);
  Injector.add(new ScheduleManager(), INJECTOR_CASES.COMMONS.SCHEDULE_MANAGER);
  Injector.add(
    new GetInitialDataGateway(),
    INJECTOR_CASES.COMMONS.GET_INITIAL_DATA
  );
};
