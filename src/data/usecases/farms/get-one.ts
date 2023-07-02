import { IBaseRepository, IBaseUseCases } from "@contracts/index";
import { IGetOneFarmExecute } from "@contracts/usecases";
import { checkFarmExist } from "./helpers";
import { Injector } from "@root/main/injector";
import { INJECTOR_REPOS } from "@root/shared";

export class GetOneFarmUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  execute: IGetOneFarmExecute = async (farm_id) => {
    this.initInstances();

    const farm = await checkFarmExist(farm_id);
    return farm || null;
  };
}
