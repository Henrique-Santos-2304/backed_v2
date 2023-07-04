import { IBaseRepository } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class GetAllUserUseCase {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  async execute() {
    this.initInstances();

    const users = await this.#baseRepo.findAll(DB_TABLES.USERS);

    return users || [];
  }
}
