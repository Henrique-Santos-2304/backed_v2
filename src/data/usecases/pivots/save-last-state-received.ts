import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  ISocketServer,
  ReturnLastStateProps,
} from "@root/domain";
import {
  GetPivotFullResponse,
  IStateReceivedPivotExecute,
} from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { checkPivotExist } from "./helpers/check-pivots";
import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";
import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";

export class SaveLastStatePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;
  #socketEmit: ISocketServer;
  #gePivotFull: IBaseUseCases<string, GetPivotFullResponse>;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);

    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#socketEmit = Injector.get(INJECTOR_COMMONS.SOCKET);

    this.#gePivotFull = Injector.get(INJECTOR_CASES.PIVOTS.GET_FULL);
  }

  private async sendEmitter(pivot_id: string) {
    const stateFull = await this.#gePivotFull.execute(pivot_id);
    const farm = await checkFarmExist(stateFull.pivot.farm_id);

    const objSendStatus = {
      users: [farm.user_id, farm.dealer, ...(farm?.users || "")],
      ...stateFull,
    };

    this.#socketEmit.publisher(`${farm?.user_id}-status`, stateFull);
  }

  private splitMessage(payload: string) {
    const arrayMessage = payload.split("-");

    if (arrayMessage.length !== 6)
      throw new Error("Formato de mensagem invalido");

    const pivot_id = arrayMessage[1];
    const message = payload.split(`${pivot_id}-`)[1];

    return { pivot_id, message };
  }

  private async putPivot(pivot_id: string, message: string) {
    await this.#baseRepo.update<Partial<PivotModel>>(
      DB_TABLES.PIVOTS,
      { pivot_id },
      {
        last_state: message,
        last_timestamp: new Date(),
        last_angle: Number(message.split("-")[2]),
      }
    );
  }

  execute: IStateReceivedPivotExecute = async ({ payload }) => {
    this.initInstances();

    const { pivot_id, message } = this.splitMessage(payload);

    this.#console.log(`Recebido Status ${message} para pivo  ${pivot_id}`);

    const oldPivot = await checkPivotExist(pivot_id);

    await this.putPivot(pivot_id, message);
    await this.sendEmitter(pivot_id);

    if (!oldPivot?.is_gprs) {
      await this.#iot.publisher(`${oldPivot?.farm_id}_0`, `#${payload}$`);
    }

    this.#console.log("Atualização de Status finalizada com sucesso... \n");
  };
}
