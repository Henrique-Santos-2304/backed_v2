import { IBaseRepository } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";
import { PivotModel } from "@root/infra/models";
import { checkFarmExist } from "../farms/helpers";

export class GetAllPivotUseCase {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  execute = async (farm_id: string) => {
    this.initInstances();

    await checkFarmExist(farm_id);

    const pivots = await this.#baseRepo.findAllByData<PivotModel>(
      DB_TABLES.PIVOTS,
      {
        farm_id,
      }
    );

    if (pivots?.length <= 0) return [];

    return pivots;
  };
}
