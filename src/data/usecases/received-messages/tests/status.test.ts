import { server } from "@root/app";
import {
  IIotConnect,
  IBaseUseCases,
  IAppLog,
  IWriteLogs,
  IObservables,
  IBaseRepository,
} from "@root/domain";
import { Injector } from "@root/main/injector";
import { IDPS, DB_TABLES } from "@root/shared";
import { MockProxy, mock } from "jest-mock-extended";
import { ReceveidStatus } from "../status";
import * as mod from "../../pivots/helpers/check-pivots";
import { PivotModel, StateModel } from "@root/infra/models";
import * as modLastStateFull from "../../states/helpers/get-state";

jest.mock("../../pivots/helpers/check-pivots", () => ({
  checkPivotExist: jest.fn(),
}));
jest.mock("../../states/helpers/get-state", () => ({
  getLastStateFull: jest.fn(),
}));

describe("Check Handler Messages Iot", () => {
  let mockInjector = jest.fn();
  let payload = [IDPS.STATUS, "test_1", "351", "080", "0", "360", "date"];

  let service: IBaseUseCases = new ReceveidStatus();

  const spySplitMsg = jest.spyOn(mod, "checkPivotExist");
  const spyGetLastStateFull = jest.spyOn(modLastStateFull, "getLastStateFull");

  let iot: MockProxy<IIotConnect>;
  let writeInLog: MockProxy<IWriteLogs>;
  let serviceStatus: MockProxy<IBaseUseCases>;
  let saveLastState: MockProxy<IBaseUseCases>;
  let checkPresure: MockProxy<IBaseUseCases>;
  let createState: MockProxy<IBaseUseCases>;
  let createVariable: MockProxy<IBaseUseCases>;
  let actionObserver: MockProxy<IObservables>;
  let angleObserver: MockProxy<IObservables>;
  let baseRepo: MockProxy<IBaseRepository>;

  let logger: MockProxy<IAppLog>;

  const inject = () => {
    mockInjector
      .mockReturnValueOnce(writeInLog)
      .mockReturnValueOnce(checkPresure)
      .mockReturnValueOnce(saveLastState)
      .mockReturnValueOnce(createState)
      .mockReturnValueOnce(createVariable)
      .mockReturnValueOnce(actionObserver)
      .mockReturnValueOnce(angleObserver)
      .mockReturnValueOnce(baseRepo);
  };

  beforeEach(() => {
    server.getHttpServer().close();
  });

  beforeAll(async () => {
    iot = mock();
    serviceStatus = mock();
    logger = mock();
    writeInLog = mock();
    saveLastState = mock();
    checkPresure = mock();
    createState = mock();
    createVariable = mock();
    actionObserver = mock();
    angleObserver = mock();
    baseRepo = mock();

    Injector.get = mockInjector;

    serviceStatus.execute.mockResolvedValue("");
    saveLastState.execute.mockResolvedValue(null);
    checkPresure.execute.mockResolvedValue(undefined);
    baseRepo.findLast.mockResolvedValue(undefined);
    actionObserver.dispatch.mockResolvedValue("");
    spySplitMsg.mockResolvedValue({} as PivotModel);
    spyGetLastStateFull.mockResolvedValue({} as StateModel);
  });

  afterAll(() => server.getHttpServer().close());

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("Should be write message in file to have been called", async () => {
    const spy = jest.spyOn(writeInLog, "write");
    inject();
    await service.execute(payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("MESSAGE", payload[1], payload.join("-"));
  });

  it("Should be checkPivotExists to have been called", async () => {
    inject();
    await service.execute(payload);

    expect(spySplitMsg).toHaveBeenCalledTimes(1);
    expect(spySplitMsg).toHaveBeenCalledWith(payload[1]);
  });

  it("Should be checkPivotExists to throw if pivot not exists", async () => {
    inject();
    spySplitMsg.mockRejectedValueOnce(new Error("Pivo não encontrado"));
    const result = service.execute(payload);

    await expect(result).rejects.toThrow();
  });

  it("Should be checkPivotExists to throw if pivot not exists", async () => {
    inject();
    spySplitMsg.mockRejectedValueOnce(new Error("Pivo não encontrado"));
    const result = service.execute(payload);

    await expect(result).rejects.toThrow();
  });

  it("Should be saveLastState to have been called", async () => {
    inject();
    const spy = jest.spyOn(saveLastState, "execute");
    await service.execute(payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ payload, isGateway: false });
  });

  it("Should be service to throw if an error ocurred in saveLastState", async () => {
    inject();
    saveLastState.execute.mockRejectedValueOnce(new Error("Error"));
    const result = service.execute(payload);

    await expect(result).rejects.toThrow();
  });

  it("Should be service check pivot had connection to have been called and update conection not have been called if return undefined", async () => {
    inject();
    const spy = jest.spyOn(baseRepo, "findLast");
    const spyPut = jest.spyOn(baseRepo, "update");

    baseRepo.findLast.mockResolvedValueOnce(undefined);
    await service.execute(payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(DB_TABLES.CONNECTIONS, {
      pivot_id: payload[1],
    });

    expect(spyPut).not.toHaveBeenCalled();
  });

  it("Should be update conection not have been called if db return pivot with connection", async () => {
    inject();
    const spyPut = jest.spyOn(baseRepo, "update");

    baseRepo.findLast.mockResolvedValueOnce({
      id: "id",
      pivot_id: payload[1],
      loss_date: new Date(Date.now() - 5000),
      recovery_date: new Date(),
      timestamp: new Date(),
    });
    await service.execute(payload);

    expect(spyPut).not.toHaveBeenCalled();
  });

  it("Should be update conection to have been called if db return pivot without connection", async () => {
    inject();
    const spyPut = jest.spyOn(baseRepo, "update");

    baseRepo.findLast.mockResolvedValueOnce({
      id: "id",
      pivot_id: payload[1],
      loss_date: new Date(Date.now() - 5000),
      timestamp: new Date(),
    });
    await service.execute(payload);

    expect(spyPut).toHaveBeenCalledTimes(1);
  });
});
