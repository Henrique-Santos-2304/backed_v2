import { IAppLog, IBaseRepository } from "@root/domain";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class GetAllUserUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  async execute() {
    this.initInstances();

    const users = await this.#baseRepo.findAll({ column: DB_TABLES.USERS });

    return users || [];
  }
}
