import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { IGetOnePivot } from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class GetOnePivot implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetOnePivot = async (id: string) => {
    this.initInstances();

    const pivot = await this.#baseRepo.findOne<PivotModel>(DB_TABLES.PIVOTS, {
      id,
    });

    return pivot;
  };
}
