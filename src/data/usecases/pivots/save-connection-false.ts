import { Injector } from "@root/main/injector";
import { checkFarmExist } from "../farms/helpers";
import { ConnectionModel, PivotModel } from "@root/infra/models";
import { checkPivotExist } from "./helpers/check-pivots";

import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
  ISocketServer,
  IWriteLogs,
} from "@root/domain";
import {
  GetPivotFullResponse,
  ISaveConnectionFalsePivotExecute,
  IStateReceivedPivotExecute,
} from "@root/domain/usecases";

import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
  splitMsgCloud,
} from "@root/shared";
import { MutationConnectionVO } from "@root/infra";

export class SaveConnectionFalsePivotUseCase {
  #baseRepo: IBaseRepository;
  #date: IAppDate;
  #console: IAppLog;
  #socketEmit: ISocketServer;
  #gePivotFull: IBaseUseCases<string, GetPivotFullResponse>;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);

    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#socketEmit = Injector.get(INJECTOR_COMMONS.SOCKET);

    this.#gePivotFull = Injector.get(INJECTOR_CASES.PIVOTS.GET_ONE);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  private async sendEmitter(pivot_id: string) {
    const stateFull = await this.#gePivotFull.execute(pivot_id);
    const farm = await checkFarmExist(stateFull.pivot.farm_id);

    this.#socketEmit.publisher(`${farm?.owner}-status`, {
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
    const alreadyExists = await this.#baseRepo.findLast<ConnectionModel>(
      DB_TABLES.CONNECTIONS,
      {
        pivot_id,
      }
    );

    if (alreadyExists && !alreadyExists?.recovery_date) return;

    const entity = new MutationConnectionVO()
      .create(Injector.get(INJECTOR_COMMONS.APP_HASH), {
        pivot_id,
      })
      .find();

    return await this.#baseRepo.create(DB_TABLES.CONNECTIONS, entity);
  }

  private async putPivot(oldPivot: PivotModel) {
    const { toList } = splitMsgCloud(oldPivot.last_state);
    const [idp, id, state, percent, init_angle, end_angle, oldDate] = toList;
    const date = this.#date.dateSpString();

    await this.#baseRepo.update<Partial<PivotModel>>(
      DB_TABLES.PIVOTS,
      { id },
      {
        last_state: `#0-${id}-000-000-${init_angle}-${end_angle}-${date}$`,
        last_timestamp: new Date(),
      }
    );
  }

  execute: ISaveConnectionFalsePivotExecute = async ({ id }) => {
    this.initInstances();

    this.#console.log(`Mudando estado do pivo ${id} para sem conexão`);

    const oldPivot = await checkPivotExist(id);

    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "LOST_CONNECTION",
      oldPivot.id,
      "Perca de conexão"
    );

    await this.putPivot(oldPivot);
    await this.saveState(id);
    await this.sendEmitter(id);

    this.#console.log("Atualização de Status finalizada com sucesso... \n");
  };
}
