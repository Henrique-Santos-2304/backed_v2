import { IBaseRepository } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class GetAllPivotUseCase {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  execute = async (farm_id: string) => {
    this.initInstances();

    const pivots = await this.#baseRepo.findAllByData(DB_TABLES.PIVOTS, {
      farm_id,
    });

    return pivots || [];
  };
}
