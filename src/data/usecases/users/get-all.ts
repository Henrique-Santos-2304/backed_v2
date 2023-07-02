import { IAppLog, IBaseRepository } from "@root/domain";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class GetAllUserUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  async execute() {
    this.initInstances();

    const users = await this.#baseRepo.findAll(DB_TABLES.USERS);

    return users || [];
  }
}
