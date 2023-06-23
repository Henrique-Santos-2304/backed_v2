import { IBaseRepository, IBaseUseCases } from "@contracts/index";
import { IGetByDealerFarmExecute } from "@contracts/usecases";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class GetAllFarmsByDealerUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetByDealerFarmExecute = async (dealer_id) => {
    this.initInstances();

    const farms = await this.#baseRepo.findAllByData<FarmModel>({
      column: DB_TABLES.FARMS,
      where: "dealer",
      equals: dealer_id,
    });

    return farms;
  };
}
