import { FarmModel } from "@db/models";
import { CreateFarmDto } from "@db/dto";
import { MutationFarmVO } from "@db/value-objects";

import { checkFarmExist } from "./helpers";
import { checkUserExists } from "../users/helpers";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IHashId,
} from "@contracts/index";
import { ICreateFarmExecute } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";

export class CreateFarmUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #uuid: IHashId;
  #console: IAppLog;

  private createEntity(farm: CreateFarmDto) {
    const vo = new MutationFarmVO();
    return vo.create(this.#uuid, farm).find();
  }

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#uuid = Injector.get(INJECTOR_COMMONS.APP_HASH);
  }

  execute: ICreateFarmExecute = async (farm: CreateFarmDto) => {
    this.initInstances();

    this.#console.log(`Criando nova Fazenda ${farm?.farm_id}`);
    await checkFarmExist(farm?.farm_id, false);

    await checkUserExists({ user_id: farm?.user_id });

    if (farm?.dealer && farm?.dealer !== "none") {
      await checkUserExists({ user_id: farm?.dealer });
    }

    const entity = this.createEntity({ ...farm });

    const newFarm = await this.#baseRepo.create<FarmModel>(
      DB_TABLES.FARMS,
      entity
    );

    this.#console.log("Fazenda criada com sucesso \n");
    return newFarm;
  };
}
