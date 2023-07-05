import { FarmModel } from "@db/models";
import {
  DB_TABLES,
  INJECTOR_CASES,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";
import { IAddUserToFarmExecute } from "@contracts/usecases";
import { IBaseRepository, IBaseUseCases, IIotConnect } from "@root/domain";
import { Injector } from "@root/main/injector";

class AddUserIntoFarmUseCase {
  #baseRepo: IBaseRepository;
  #iot: IIotConnect;
  #createUserService: IBaseUseCases;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = Injector.get(INJECTOR_COMMONS.IOT_CONFIG);
    this.#createUserService = Injector.get(INJECTOR_CASES.USERS.CREATE);
  }

  execute: IAddUserToFarmExecute = async (data) => {
    this.initInstances();

    const newUser = await this.#createUserService.execute({
      username: data.username,
      password: data.password,
      user_type: "WORKER",
    });

    const farm = await this.#baseRepo.findOne<FarmModel>(DB_TABLES.FARMS, {
      id: data.id,
    });

    const newFarm = await this.#baseRepo.update<FarmModel>(
      DB_TABLES.FARMS,
      { id: data.id },
      { workers: [...new Set([...farm.workers!, newUser.username])] }
    );

    if (!data?.isGateway) {
      await this.#iot?.publisher(
        `${farm?.id}_0`,
        JSON.stringify({
          type: "ADD_WORKER",
          username: data.username,
          password: data.password,
        })
      );
    }

    return newFarm;
  };
}

export { AddUserIntoFarmUseCase };
