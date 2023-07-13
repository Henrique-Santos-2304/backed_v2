import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";
import { checkPivotExist } from "./helpers/check-pivots";

import {
  DB_TABLES,
  IDPS,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
  splitMsgCloud,
} from "@root/shared";

import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  ISocketServer,
} from "@root/domain";
import {
  GetPivotFullResponse,
  IStateReceivedPivotExecute,
} from "@root/domain/usecases";

export class SaveLastStatePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;
  #date: IAppDate;
  #socketEmit: ISocketServer;
  #gePivotFull: IBaseUseCases<string, GetPivotFullResponse>;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);

    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#socketEmit = Injector.get(INJECTOR_COMMONS.SOCKET);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);

    this.#gePivotFull = Injector.get(INJECTOR_CASES.PIVOTS.GET_ONE);
  }

  private alterPowerForOn(oldState: string, newState: String) {
    const oldList = splitMsgCloud(oldState);
    const state = oldList.toList[2];

    return state[2] === "2" && newState[2] === "1";
  }

  private async sendEmitter(pivot: PivotModel) {
    const farm = await checkFarmExist(pivot?.farm_id);

    this.#socketEmit.publisher(`${farm?.owner}-status`, pivot?.last_state);
  }

  private async putPivot(
    message: string[],
    oldAngle: number,
    alterPowerOn: boolean
  ) {
    const [_, id, state, percent, angle, __] = message;
    const init_angle = alterPowerOn ? angle : oldAngle;

    return await this.#baseRepo.update<any>(
      DB_TABLES.PIVOTS,
      { id },
      {
        last_state: `#${
          IDPS.STATUS
        }-${id}-${state}-${init_angle}-${angle}-${this.#date.dateSpString()}$`,
        last_timestamp: new Date(),
        init_angle: Number(init_angle),
      }
    );
  }

  execute: IStateReceivedPivotExecute = async ({ payload }) => {
    this.initInstances();
    const [_, id, state, ...__] = payload;
    this.#console.log(`Recebido Status ${payload.join("-")} para pivô ${id}`);

    const oldPivot = await checkPivotExist(id);
    const alterPower = this.alterPowerForOn(oldPivot?.last_state, state);

    const piv: PivotModel = await this.putPivot(
      payload,
      oldPivot?.init_angle,
      alterPower
    );

    await this.sendEmitter(piv);

    if (!oldPivot?.is_gprs) {
      await this.#iot.publisher(`${oldPivot?.farm_id}_0`, `#${payload}$`);
    }

    this.#console.log("Atualização de Status finalizada com sucesso... \n");
  };
}
