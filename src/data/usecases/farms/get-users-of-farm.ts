import { IBaseRepository, IBaseUseCases } from "@contracts/index";
import { IUsersOfFarmExecute } from "@contracts/usecases";
import { checkFarmExist } from "./helpers";
import { UserModel } from "@root/infra/models";
import { checkUserExists } from "../users/helpers";
import { Injector } from "@root/main/injector";
import { INJECTOR_REPOS } from "@root/shared";

export class GetUsersOfFarmUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }

  private async getUsers(users: string[]) {
    const usersFinded: Omit<UserModel, "password" | "secret">[] = [];

    for (let user_id of users!) {
      const user = await checkUserExists(this.#baseRepo.findOne, user_id);

      const { password, secret, ...rest } = user;
      usersFinded.push(rest);
    }

    return usersFinded;
  }

  execute: IUsersOfFarmExecute = async (farm_id) => {
    this.initInstances();

    const farm = await checkFarmExist(this.#baseRepo.findOne, farm_id);

    if (!farm?.users || farm?.users?.length <= 0) return [];

    return await this.getUsers(farm?.users!);
  };
}
