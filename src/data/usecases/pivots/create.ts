import { checkPivotExist } from "./helpers/check-pivots";
import { checkFarmExist } from "../farms/helpers";

import {
  IAppDate,
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IIotConnect,
} from "@root/domain";
import { ICreatePivotExecute } from "@root/domain/usecases";

import { PivotModel } from "@db/models";
import { CreatePivotDto } from "@db/dto";
import { MutationPivotVO } from "@db/value-objects/pivot";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class CreatePivotUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;
  #date: IAppDate;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  private createEntity(pivot: CreatePivotDto) {
    const vo = new MutationPivotVO();

    return vo.create(this.#date, pivot).find();
  }

  execute: ICreatePivotExecute = async ({ pivot, isGateway }) => {
    this.initInstances();

    this.#console.log(`Criando novo Pivô para fazenda ${pivot?.farm_id}`);
    await Promise.all([
      checkPivotExist(`${pivot?.farm_id}_${pivot?.num}`, false),
      checkFarmExist(pivot?.farm_id),
    ]);

    const entity = this.createEntity(pivot);

    const newPivot = await this.#baseRepo.create<PivotModel>(
      DB_TABLES.PIVOTS,
      entity
    );

    if (isGateway) {
      await this.#iot?.publisher(
        `${pivot?.farm_id}_0`,
        JSON.stringify({
          type: "ADD_PIVOT",
          entity,
        })
      );
    }

    this.#console.log(`Criação finalizada...\n`);

    return newPivot;
  };
}
