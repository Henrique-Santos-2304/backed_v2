import { UserModel } from "@db/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { MutationUserVO } from "@db/value-objects";
import { checkDataExists } from "@shared/db-helpers";
import { IPutUserExecute } from "@contracts/usecases";

import {
  IAppLog,
  IBaseRepository,
  IEncrypt,
  IHashId,
  ITokenValidator,
} from "@root/domain";
import { Injector } from "@root/main/injector";
import { checkUserExists } from "./helpers";

export class UpdateUserUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #hash: IHashId;
  #token: ITokenValidator;
  #encrypter: IEncrypt;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#token = Injector.get(INJECTOR_COMMONS.APP_TOKEN);
    this.#hash = Injector.get(INJECTOR_COMMONS.APP_HASH);

    this.#encrypter = Injector.get(INJECTOR_COMMONS.APP_ENCRYPTER);
  }

  private createEntity(old: UserModel, user: UserModel) {
    const vo = new MutationUserVO(this.#hash, this.#encrypter, this.#token);
    return vo.update(old, user).find();
  }

  execute: IPutUserExecute = async (user) => {
    this.initInstances();

    this.#console.log("Atualizando usuário");

    console.log("passou check");
    const exists = await checkUserExists({ user_id: user?.user_id! });
    console.log(exists);
    const newUser = this.createEntity(exists, user);

    const updated = await this.#baseRepo.update<UserModel>(
      DB_TABLES.USERS,
      { user_id: user?.user_id },
      newUser
    );

    this.#console.log("Finalizando Atualização de usuário\n");

    return updated;
  };
}
