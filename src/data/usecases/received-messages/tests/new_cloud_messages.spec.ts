import { server } from "@root/app";
import { Injector } from "@root/main/injector";
import { IDPS } from "@root/shared";
import { IAppLog, IBaseUseCases, IIotConnect } from "@root/domain";
import * as mod from "../../../../shared/split-message";
import { NewCloudMessages } from "../new-format-msg-cloud";
import { mock, MockProxy } from "jest-mock-extended";

jest.mock("../../../../shared/split-message");
describe("Check Handler Messages Iot", () => {
  let mockInjector = jest.fn();

  let iot: MockProxy<IIotConnect>;
  let serviceStatus: MockProxy<IBaseUseCases>;
  let logger: MockProxy<IAppLog>;

  const spySplitMsg = jest.spyOn(mod, "splitMsgCloud");
  let message = `#${IDPS.STATUS}-test_1-351-080-0-360-date$`;

  const buffer = Buffer.from(message);

  beforeAll(async () => {
    iot = mock();
    serviceStatus = mock();
    logger = mock();
    Injector.get = mockInjector;
    mockInjector.mockReturnValue(iot).mockReturnValue(serviceStatus);
    spySplitMsg.mockReturnValue({
      toList: message.split("#")[1].split("$")[0].split("-"),
      msg: message,
      idp: IDPS.STATUS,
    });
    serviceStatus.execute.mockResolvedValue("");
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.getHttpServer().close();
  });

  it("[e2e] Should be splitMessage to have been called", async () => {
    await NewCloudMessages.start(buffer);

    expect(spySplitMsg).toHaveBeenCalledTimes(1);
    expect(spySplitMsg).toHaveBeenCalledWith(message);
  });

  it("[e2e] Should service publisher to have been called before service nad send ack", async () => {
    mockInjector.mockReturnValueOnce(iot);

    const spy = jest.spyOn(iot, "publisher");
    await NewCloudMessages.start(buffer);

    expect(spy).toHaveBeenCalledWith(
      "test_1",
      `#${IDPS.CHECK_CONNECTION}-test_1$`
    );
  });

  it("[e2e] Should service status to have been called", async () => {
    mockInjector.mockReturnValueOnce(iot).mockReturnValueOnce(serviceStatus);
    const spy = jest.spyOn(serviceStatus, "execute");
    await NewCloudMessages.start(buffer);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      message.split("#")[1].split("$")[0].split("-")
    );
  });

  it("[e2e] Should service return undefined and logger invalid format on service status", async () => {
    mockInjector.mockReturnValueOnce(iot).mockReturnValueOnce(logger);
    const spy = jest.spyOn(serviceStatus, "execute");
    const spyLogger = jest.spyOn(logger, "error");
    const msgBuff = Buffer.from(`#${IDPS.STATUS}-test_1-080-0-360-date$`);
    const msg = msgBuff.toString();

    spySplitMsg.mockReturnValueOnce({
      toList: msg.split("#")[1].split("$")[0].split("-"),
      msg,
      idp: IDPS.STATUS,
    });

    const result = await NewCloudMessages.start(buffer);

    expect(spy).not.toHaveBeenCalled();
    expect(spyLogger).toHaveBeenCalledWith("Formato Inválido");
    expect(result).toBeUndefined();
  });

  it("[e2e] Should service return undefined and logger invalid format on service get-initial-data", async () => {
    mockInjector.mockReturnValueOnce(logger);
    const spy = jest.spyOn(serviceStatus, "execute");
    const spyLogger = jest.spyOn(logger, "error");
    const msgBuff = Buffer.from(`#${IDPS.GET_INITIAL_DATA}-test_1-invalid$`);
    const msg = msgBuff.toString();

    spySplitMsg.mockReturnValueOnce({
      toList: msg.split("#")[1].split("$")[0].split("-"),
      msg,
      idp: IDPS.GET_INITIAL_DATA,
    });

    const result = await NewCloudMessages.start(buffer);

    expect(spy).not.toHaveBeenCalled();
    expect(spyLogger).toHaveBeenCalledWith("Formato Inválido");
    expect(result).toBeUndefined();
  });

  it("[e2e] Should service return undefined and logger invalid format on service check_connection", async () => {
    mockInjector.mockReturnValueOnce(logger);
    const spy = jest.spyOn(serviceStatus, "execute");
    const spyLogger = jest.spyOn(logger, "error");
    const msgBuff = Buffer.from(`#${IDPS.CHECK_CONNECTION}-test_1-invalid$`);
    const msg = msgBuff.toString();

    spySplitMsg.mockReturnValueOnce({
      toList: msg.split("#")[1].split("$")[0].split("-"),
      msg,
      idp: IDPS.CHECK_CONNECTION,
    });

    const result = await NewCloudMessages.start(buffer);

    expect(spy).not.toHaveBeenCalled();
    expect(spyLogger).toHaveBeenCalledWith("Formato Inválido");
    expect(result).toBeUndefined();
  });

  it("[e2e] Should service get initial data to have been called", async () => {
    mockInjector.mockReturnValueOnce(serviceStatus);

    const spy = jest.spyOn(serviceStatus, "execute");
    const msgBuff = Buffer.from(`#${IDPS.GET_INITIAL_DATA}-farm_id$`);
    const msg = msgBuff.toString();

    spySplitMsg.mockReturnValueOnce({
      toList: msg.split("#")[1].split("$")[0].split("-"),
      msg,
      idp: IDPS.GET_INITIAL_DATA,
    });

    await NewCloudMessages.start(msgBuff);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("farm_id");
  });

  it("[e2e] Should service check connection to be called publisher and send ack", async () => {
    mockInjector.mockReturnValueOnce(iot);

    const spy = jest.spyOn(iot, "publisher");
    const msgBuff = Buffer.from(`#${IDPS.CHECK_CONNECTION}-pivot_id$`);
    const msg = msgBuff.toString();

    spySplitMsg.mockReturnValueOnce({
      toList: msg.split("#")[1].split("$")[0].split("-"),
      msg,
      idp: IDPS.CHECK_CONNECTION,
    });

    await NewCloudMessages.start(msgBuff);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("pivot_id", msg);
  });
});
