import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { FarmModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";

export class GetAllFarmsUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  async execute() {
    this.initInstances();

    return await this.#baseRepo.findAll<FarmModel>({
      column: DB_TABLES.FARMS,
    });
  }
}
