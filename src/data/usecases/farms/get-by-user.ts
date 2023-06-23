import { IBaseRepository, IBaseUseCases } from "@contracts/index";
import { IGetByDealerFarmExecute } from "@contracts/usecases";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class GetAllFarmsByUserUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetByDealerFarmExecute = async (user_id) => {
    this.initInstances();

    const farms = await this.#baseRepo.findAll<FarmModel>({
      column: DB_TABLES.FARMS,
    });

    return farms?.filter(
      (farm) => farm?.user_id === user_id || farm?.users?.includes(user_id)
    );
  };
}
