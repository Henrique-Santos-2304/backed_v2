import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";
import { PivotModel } from "@root/infra/models";
import { checkPivotExist } from "./helpers/check-pivots";

import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  ISocketServer,
  IWriteLogs,
} from "@root/domain";
import {
  GetPivotFullResponse,
  IStateReceivedPivotExecute,
} from "@root/domain/usecases";

import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";

export class SaveConnectionFalsePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;
  #socketEmit: ISocketServer;
  #gePivotFull: IBaseUseCases<string, GetPivotFullResponse>;
  #createState: IBaseUseCases;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#createState = Injector.get(INJECTOR_CASES.STATES.CREATE);

    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#socketEmit = Injector.get(INJECTOR_COMMONS.SOCKET);

    this.#gePivotFull = Injector.get(INJECTOR_CASES.PIVOTS.GET_FULL);
  }

  private async sendEmitter(pivot_id: string) {
    const stateFull = await this.#gePivotFull.execute(pivot_id);
    const farm = await checkFarmExist(stateFull.pivot.farm_id);

    this.#socketEmit.publisher(`${farm?.user_id}-status`, {
      ...stateFull,
      state: {
        ...stateFull.state,
        power: false,
        water: false,
        direction: "CLOCKWISE",
        connection: false,
      },
    });
  }

  private async saveState(pivot_id: string) {
    return await this.#createState.execute({
      pivot_id,
      connection: false,
      power: false,
      water: false,
      direction: "CLOCKWISE",
    });
  }

  private async putPivot(oldPivot: PivotModel) {
    const lastState = oldPivot.last_state?.split("-");
    const date = new Date();

    await this.#baseRepo.update<Partial<PivotModel>>(
      DB_TABLES.PIVOTS,
      { pivot_id: oldPivot.pivot_id },
      {
        last_state: `000-${lastState[1]}-${
          lastState[2]
        }-${new Date().valueOf()}`,
        last_timestamp: date,
      }
    );
  }

  execute: IStateReceivedPivotExecute = async ({ payload }) => {
    this.initInstances();

    this.#console.log(`Mudando estado do pivo ${payload} para sem conexão`);

    const oldPivot = await checkPivotExist(payload);

    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "LOST_CONNECTION",
      oldPivot.pivot_id,
      "Perca de conexão"
    );

    await this.putPivot(oldPivot);
    await this.saveState(payload);
    await this.sendEmitter(payload);

    if (!oldPivot?.is_gprs) {
      await this.#iot.publisher(
        `${oldPivot?.farm_id}_0`,
        `#0-${oldPivot.pivot_num}$`
      );
    }

    this.#console.log("Atualização de Status finalizada com sucesso... \n");
  };
}
