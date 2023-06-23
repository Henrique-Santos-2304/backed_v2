import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { checkPivotExist } from "../pivots/helpers";
import { Injector } from "@root/main/injector";

export class GetAllStatesUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute = async (pivot_id: string) => {
    this.initInstances();
    await checkPivotExist(this.#baseRepo.findOne, pivot_id);

    return (
      (await this.#baseRepo.findAllByData({
        column: DB_TABLES.STATES,
        where: "pivot_id",
        equals: pivot_id,
      })) || []
    );
  };
}
