import { server } from "@root/app";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";
import { IHandlerMessageIot } from "@root/domain";

import {
  NewCloudMessages,
  OldCloudMessages,
  ReceivedGatewayMessages,
  SchedulingMessages,
} from "@root/data";

describe("Check Handler Messages Iot", () => {
  let user = {} as any;
  let handler: IHandlerMessageIot;
  let newCloudMessage = jest.fn();
  let oldCloudMessages = jest.fn();
  let receivedGatewayMessages = jest.fn();
  let schedulingMessages = jest.fn();

  beforeAll(async () => {
    server.start();
    handler = Injector.get<IHandlerMessageIot>(
      INJECTOR_COMMONS.IOT_HANDLER_MESSAGE
    );
    NewCloudMessages.start = newCloudMessage;
    OldCloudMessages.start = oldCloudMessages;
    ReceivedGatewayMessages.start = receivedGatewayMessages;
    SchedulingMessages.start = schedulingMessages;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should anywhere method to Have been called", async () => {
    const spy = jest.spyOn(NewCloudMessages, "start");
    const spyOld = jest.spyOn(OldCloudMessages, "start");
    const spyGateway = jest.spyOn(ReceivedGatewayMessages, "start");
    const spyScheduling = jest.spyOn(SchedulingMessages, "start");

    const message = Buffer.from(`#0-test_1-351-080-0-360-date$`);
    await handler.handler("process.env.NEW_AWS_CLOUD", message);

    expect(spy).not.toHaveBeenCalled();
    expect(spyOld).not.toHaveBeenCalled();
    expect(spyGateway).not.toHaveBeenCalled();
    expect(spyScheduling).not.toHaveBeenCalled();
  });

  it("[e2e] Should be NewCloud Message toHave been called", async () => {
    const spy = jest.spyOn(NewCloudMessages, "start");
    const spyOld = jest.spyOn(OldCloudMessages, "start");
    const spyGateway = jest.spyOn(ReceivedGatewayMessages, "start");
    const spyScheduling = jest.spyOn(SchedulingMessages, "start");

    const message = Buffer.from(`#0-test_1-351-080-0-360-date$`);
    await handler.handler(process.env.NEW_AWS_CLOUD, message);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyOld).not.toHaveBeenCalled();
    expect(spyGateway).not.toHaveBeenCalled();
    expect(spyScheduling).not.toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith(message);
  });

  it("[e2e] Should be old Message toHave been called", async () => {
    const spy = jest.spyOn(OldCloudMessages, "start");
    const spyNew = jest.spyOn(NewCloudMessages, "start");
    const spyGateway = jest.spyOn(ReceivedGatewayMessages, "start");
    const spyScheduling = jest.spyOn(SchedulingMessages, "start");

    const message = Buffer.from(
      JSON.stringify({
        type: "status",
        id: "test_1",
        payload: "351-080-360-date",
      })
    );

    await handler.handler(process.env.AWS_CLOUD, message);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyNew).not.toHaveBeenCalled();
    expect(spyGateway).not.toHaveBeenCalled();
    expect(spyScheduling).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(message);
  });

  it("[e2e] Should be Gateway Message toHave been called", async () => {
    const spy = jest.spyOn(ReceivedGatewayMessages, "start");
    const spyNew = jest.spyOn(NewCloudMessages, "start");
    const spyOld = jest.spyOn(OldCloudMessages, "start");
    const spyScheduling = jest.spyOn(SchedulingMessages, "start");

    const message = Buffer.from(`#0-test_1-351-080-0-360-date$`);

    await handler.handler(process.env.GATEWAY_MESSAGES, message);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(message);
    expect(spyNew).not.toHaveBeenCalled();
    expect(spyOld).not.toHaveBeenCalled();
    expect(spyScheduling).not.toHaveBeenCalled();
  });

  it("[e2e] Should be Scheduling Message toHave been called", async () => {
    const spy = jest.spyOn(SchedulingMessages, "start");
    const spyNew = jest.spyOn(NewCloudMessages, "start");
    const spyOld = jest.spyOn(OldCloudMessages, "start");
    const spyGateway = jest.spyOn(ReceivedGatewayMessages, "start");

    const message = Buffer.from(`#12-test_1-ID_SCHE$`);
    await handler.handler(process.env.AWS_SCHEDULING, message);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(message);
    expect(spyNew).not.toHaveBeenCalled();
    expect(spyOld).not.toHaveBeenCalled();
    expect(spyGateway).not.toHaveBeenCalled();
  });
});
