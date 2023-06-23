import { checkPivotExist } from "./helpers/check-pivots";
import { checkFarmExist } from "../farms/helpers";

import {
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

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  private createEntity(pivot: CreatePivotDto) {
    const vo = new MutationPivotVO();

    return vo.create(pivot).find();
  }

  private mountSyncForGateway(pivot: PivotModel) {
    let pivotString = "";

    for (let [key, value] of Object.entries(pivot)) {
      pivotString += `-${key}::${value}`;
    }
    return "#" + `2002:C${pivotString}$`;
  }

  execute: ICreatePivotExecute = async ({ pivot, isGateway }) => {
    this.initInstances();

    this.#console.log(`Criando novo Pivô para fazenda ${pivot?.farm_id}`);
    await Promise.all([
      checkPivotExist(
        this.#baseRepo.findOne,
        `${pivot?.farm_id}_${pivot?.pivot_num}`,
        false
      ),
      checkFarmExist(this.#baseRepo.findOne, pivot?.farm_id),
    ]);

    const entity = this.createEntity(pivot);

    const newPivot = await this.#baseRepo.create<PivotModel>({
      column: DB_TABLES.PIVOTS,
      data: entity,
    });

    if (isGateway) {
      await this.#iot?.publisher(
        `${pivot?.farm_id}_0`,
        this.mountSyncForGateway(newPivot)
      );
    }

    this.#console.log(`Criação finalizada...\n`);

    return newPivot;
  };
}
