import { UserModel } from "@db/models";
import { DB_TABLES } from "@root/shared";
import { MutationUserVO } from "@db/value-objects";
import { checkDataExists } from "@shared/db-helpers";
import { IPutUserExecute } from "@contracts/usecases";
import { console } from "@main/composers";

import {
  IBaseRepository,
  IEncrypt,
  IHashId,
  ITokenValidator,
} from "@root/domain";

export class UpdateUserUseCase {
  constructor(
    private baseRepo: IBaseRepository,
    private uuid: IHashId,
    private encrypter: IEncrypt,
    private jwt: ITokenValidator
  ) {}

  private createEntity(old: UserModel, user: UserModel) {
    const vo = new MutationUserVO(this.uuid, this.encrypter, this.jwt);
    return vo.update(old, user).find();
  }

  execute: IPutUserExecute = async (user) => {
    console.log("Atualizando usuário");

    const exists = await checkDataExists<UserModel>(
      this.baseRepo.findOne,
      {
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: user?.user_id!,
      },
      "Usuário",
      true
    );

    const newUser = this.createEntity(exists, user);

    const updated = await this.baseRepo.update<UserModel>({
      column: DB_TABLES.USERS,
      where: "user_id",
      equals: user?.user_id!,
      data: newUser,
    });
    console.log("Finalizando Atualização de usuário\n");

    return updated;
  };
}
