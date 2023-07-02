import { IBaseRepository, IBaseUseCases } from "@contracts/index";
import { IGetByDealerFarmExecute } from "@contracts/usecases";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class GetAllFarmsByUserUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetByDealerFarmExecute = async (user_id) => {
    this.initInstances();

    const farms = await this.#baseRepo.findAllByData(DB_TABLES.FARMS, {
      OR: [{ user_id }, { users: { has: user_id } }],
    });

    return (farms as unknown as FarmModel[]) || [];
  };
}
