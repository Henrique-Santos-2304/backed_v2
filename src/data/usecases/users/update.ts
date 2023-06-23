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

export class UpdateUserUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #hash: IHashId;
  #token: ITokenValidator;
  #encrypter: IEncrypt;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#token = this.#token ?? Injector.get(INJECTOR_COMMONS.APP_TOKEN);
    this.#hash = this.#hash ?? Injector.get(INJECTOR_COMMONS.APP_HASH);

    this.#encrypter =
      this.#encrypter ?? Injector.get(INJECTOR_COMMONS.APP_ENCRYPTER);
  }

  private createEntity(old: UserModel, user: UserModel) {
    const vo = new MutationUserVO(this.#hash, this.#encrypter, this.#token);
    return vo.update(old, user).find();
  }

  execute: IPutUserExecute = async (user) => {
    this.initInstances();

    this.#console.log("Atualizando usuário");

    const exists = await checkDataExists<UserModel>(
      this.#baseRepo.findOne,
      {
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: user?.user_id!,
      },
      "Usuário",
      true
    );

    const newUser = this.createEntity(exists, user);

    const updated = await this.#baseRepo.update<UserModel>({
      column: DB_TABLES.USERS,
      where: "user_id",
      equals: user?.user_id!,
      data: newUser,
    });
    this.#console.log("Finalizando Atualização de usuário\n");

    return updated;
  };
}
