import { FarmModel } from "@db/models";
import { CreateFarmDto } from "@db/dto";
import { MutationFarmVO } from "@db/value-objects";

import { checkFarmExist } from "./helpers";
import { checkUserExists } from "../users/helpers";

import { ICreateFarmExecute } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";

import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IGetTimezone,
} from "@contracts/index";

export class CreateFarmUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private createEntity(farm: CreateFarmDto) {
    const vo = new MutationFarmVO();
    return vo.create(farm).find();
  }

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  execute: ICreateFarmExecute = async (farm: CreateFarmDto) => {
    this.initInstances();

    this.#console.log(`Criando nova Fazenda ${farm?.id}`);
    await checkFarmExist(farm?.id, false);

    await checkUserExists({ id: farm?.owner });

    if (farm?.dealer && farm?.dealer !== "none") {
      await checkUserExists({ id: farm?.dealer });
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
