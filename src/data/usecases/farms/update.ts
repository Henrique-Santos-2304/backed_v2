import { IAppLog, IBaseRepository, IIotConnect } from "@contracts/index";
import { IPutFarmExecute } from "@root/domain/usecases";
import { FarmModel, PivotModel } from "@root/infra/models";
import { checkFarmExist } from "./helpers";
import { MutationFarmVO } from "@root/infra/value-objects";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class UpdateFarmUseCase {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  private createEntity(old: FarmModel, newFarm: FarmModel) {
    const vo = new MutationFarmVO();
    return vo.update(old, newFarm).find();
  }

  private async checkFarmIdEqualsAndPutPivots(
    oldFarmId: string,
    newFarmId: string
  ) {
    if (oldFarmId === newFarmId) return;
    const pivots = await this.#baseRepo.findAllByData<PivotModel>(
      DB_TABLES.PIVOTS,
      { farm_id: newFarmId }
    );

    if (!pivots || pivots?.length <= 0) return;

    for (let pivot of pivots) {
      await this.#baseRepo.update(
        DB_TABLES.PIVOTS,
        { id: pivot?.id },
        {
          id: `${newFarmId}_${pivot?.num}`,
        }
      );
    }
  }

  execute: IPutFarmExecute = async ({ farm, farm_id, isGateway }) => {
    this.initInstances();

    this.#console.log(`Atualizando fazenda ${farm_id}`);
    const exists = await checkFarmExist(farm_id);

    const newFarm = this.createEntity(exists, farm);

    const updated = await this.#baseRepo.update<FarmModel>(
      DB_TABLES.FARMS,
      { id: farm_id },
      newFarm
    );

    await this.checkFarmIdEqualsAndPutPivots(farm_id, farm?.id);

    await this.#iot?.publisher(
      `${updated?.id}_0`,
      JSON.stringify({
        type: "PUT_FARM",
        ...updated,
      })
    );

    this.#console.log("Finalizada atualização do usuário");

    return updated;
  };
}
