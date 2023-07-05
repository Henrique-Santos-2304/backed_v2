import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { FarmModel, UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { checkUserExists } from "../users/helpers";

export class GetAllFarmsUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
  }

  private mountQueryByRole(user: UserModel): any {
    if (user?.user_type === "DEALER") return { dealer: user.id };
    if (user?.user_type === "OWNER") return { owner: user.id };
    return { workers: { has: user.username } };
  }

  async execute(id: string) {
    this.initInstances();
    console.log("Id ", id);

    const user = await checkUserExists({ id });

    console.log("User ", JSON.stringify(user));

    if (user.user_type === "SUDO") {
      return await this.#baseRepo.findAll<FarmModel>(DB_TABLES.FARMS);
    }

    const query = this.mountQueryByRole(user);
    console.log("Query ", JSON.stringify(query));
    console.log(await this.#baseRepo.findAll(DB_TABLES.FARMS));
    return await this.#baseRepo.findAllByData(DB_TABLES.FARMS, query);
  }
}
