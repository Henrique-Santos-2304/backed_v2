import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { IGetAllPivotFull } from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_CASES, INJECTOR_REPOS } from "@root/shared";

export class GetAllPivotsFull implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetAllPivotFull = async (farm_id: string) => {
    this.initInstances();

    const response = [];

    const pivots = await this.#baseRepo.findAllByData<PivotModel>({
      column: DB_TABLES.PIVOTS,
      where: "farm_id",
      equals: farm_id,
    });

    if (!pivots || pivots?.length <= 0) return [];

    for (let pivot of pivots) {
      const pivResponse = await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.GET_FULL
      ).execute(pivot?.pivot_id);
      response.push(pivResponse);
    }

    return response;
  };
}
