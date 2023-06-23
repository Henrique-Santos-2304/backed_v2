import { IAppLog, IBaseRepository, IIotConnect } from "@contracts/index";
import { IPutFarmExecute } from "@root/domain/usecases";
import { FarmModel } from "@root/infra/models";
import { checkFarmExist } from "./helpers";
import { MutationFarmVO } from "@root/infra/value-objects";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class UpdateFarmUseCase {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  createEntity(old: FarmModel, newFarm: FarmModel) {
    const vo = new MutationFarmVO();
    return vo.update(old, newFarm).find();
  }

  execute: IPutFarmExecute = async ({ farm, isGateway }) => {
    this.initInstances();

    this.#console.log(`Atualizando fazenda ${farm?.farm_id}`);
    const exists = await checkFarmExist(this.#baseRepo.findOne, farm?.farm_id);

    const newFarm = this.createEntity(exists, farm);

    const updated = await this.#baseRepo.update({
      column: DB_TABLES.FARMS,
      where: "farm_id",
      equals: farm?.farm_id,
      data: newFarm,
    });

    await this.#iot?.publisher(
      `${updated?.farm_id}_0`,
      `2001:U-${updated?.user_id}-${updated?.farm_id}-${updated?.farm_name}-${
        updated?.farm_city
      }-${updated?.farm_lat}-${updated?.farm_lng}${
        updated?.dealer ? `-${updated?.dealer}` : ""
      }`
    );

    this.#console.log("Finalizada atualização do usuário");

    return updated;
  };
}
