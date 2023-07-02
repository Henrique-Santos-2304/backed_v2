import { IBaseUseCases } from "@contracts/index";
import { IUsersOfFarmExecute } from "@contracts/usecases";
import { checkFarmExist } from "./helpers";
import { UserModel } from "@root/infra/models";
import { checkUserExists } from "../users/helpers";

export class GetUsersOfFarmUseCase implements IBaseUseCases {
  private async getUsers(users: string[]) {
    const usersFinded: Omit<UserModel, "password" | "secret">[] = [];

    for (let user_id of users!) {
      const user = await checkUserExists({ user_id });

      const { password, secret, ...rest } = user;
      usersFinded.push(rest);
    }

    return usersFinded;
  }

  execute: IUsersOfFarmExecute = async (farm_id) => {
    const farm = await checkFarmExist(farm_id);

    if (!farm?.users || farm?.users?.length <= 0) return [];

    return await this.getUsers(farm?.users!);
  };
}
