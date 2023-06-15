import { UserModel } from "@db/models";
import { DB_TABLES } from "@shared/index";
import { console } from "@main/composers";
import { IAuthUserExecute } from "@root/domain/usecases";

import {
  IBaseRepository,
  IBaseUseCases,
  IEncrypt,
  ITokenValidator,
} from "@contracts/index";

export class AuthUseCase implements IBaseUseCases {
  constructor(
    private baseRepo: IBaseRepository,
    private encrypt: IEncrypt,
    private token: ITokenValidator
  ) {}

  private async comparePassword(password: UserModel["password"], hash: string) {
    const isEquals = this.encrypt.compare(password, hash);
    if (!isEquals) throw new Error("Invalid Credentials");
  }

  private async checkExists(login: UserModel["login"]): Promise<UserModel> {
    const user = await this.baseRepo.findOne<UserModel>({
      column: DB_TABLES.USERS,
      where: "login",
      equals: login,
    });

    if (!user) throw new Error("Invalid Credentials");
    return user;
  }

  private async generateToken(user: UserModel) {
    const { login, user_id, user_type } = user;
    return this.token.encrypt({ login, user_id, user_type });
  }

  execute: IAuthUserExecute = async ({ login, password }) => {
    console.log(`Iniciando autenticação do usuário ${login}`);
    const user = await this.checkExists(login);

    await this.comparePassword(password, user.password);

    const token = await this.generateToken(user);
    console.log(`Usuário logado com sucesso\n`);

    return { user_id: user?.user_id, user_type: user?.user_type, token };
  };
}
