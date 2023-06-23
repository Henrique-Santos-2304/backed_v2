import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class GetAllStateVariableUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  execute = async (state_id: string) => {
    this.initInstances();

    const variables = await this.#baseRepo.findAllByData({
      column: DB_TABLES.STATE_VARIABLES,
      where: "state_id",
      equals: state_id,
    });

    return variables || [];
  };
}
