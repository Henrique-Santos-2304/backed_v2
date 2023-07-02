import { FarmModel } from "@db/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { IAddUserToFarmExecute } from "@contracts/usecases";
import { IBaseRepository, IIotConnect } from "@root/domain";

import { checkFarmExist } from "./helpers";
import { checkUserExists } from "../users/helpers";
import { Injector } from "@root/main/injector";

class AddUserIntoFarmUseCase {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;

  private checkUserAlreadyExistsInFarm(user_id: string, farm: FarmModel) {
    const isUserOwner = farm?.user_id === user_id;
    const isDealerOwner = farm?.dealer === user_id;
    const userExists = farm?.users?.find((u) => u === user_id);

    if (isUserOwner || userExists || isDealerOwner) {
      throw new Error("usuário já faz parte dessa Fazenda");
    }
  }

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
  }

  execute: IAddUserToFarmExecute = async ({ user_id, farm_id, isGateway }) => {
    this.initInstances();

    const farm = await checkFarmExist(farm_id);
    await checkUserExists({ user_id });

    this.checkUserAlreadyExistsInFarm(user_id!, farm);

    const newUsers = [...farm?.users!, user_id];

    const newFarm = await this.#baseRepo.update<FarmModel>(
      DB_TABLES.FARMS,
      { farm_id },
      {
        users: newUsers,
      }
    );

    if (!isGateway) {
      await this.#iot?.publisher(`${farm?.farm_id}_0`, `2001:ADD-${user_id}`);
    }

    return newFarm;
  };
}

export { AddUserIntoFarmUseCase };
