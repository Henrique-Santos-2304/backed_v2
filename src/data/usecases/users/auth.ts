import { UserModel } from "@db/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@shared/index";
import { IAuthUserExecute } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";

import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IEncrypt,
  ITokenValidator,
} from "@contracts/index";

export class AuthUseCase implements IBaseUseCases {
  #console: IAppLog;
  #baseRepo: IBaseRepository;
  #encrypter: IEncrypt;
  #token: ITokenValidator;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
    this.#encrypter = Injector.get(INJECTOR_COMMONS.APP_ENCRYPTER);
    this.#token = Injector.get(INJECTOR_COMMONS.APP_TOKEN);
  }

  private async comparePassword(password: UserModel["password"], hash: string) {
    const isEquals = this.#encrypter?.compare(password, hash);
    if (!isEquals) throw new Error("Invalid Credentials");
  }

  private async checkExists(
    username: UserModel["username"]
  ): Promise<UserModel> {
    const user = await this.#baseRepo?.findOne<UserModel>(DB_TABLES.USERS, {
      username,
    });

    if (!user) throw new Error("Invalid Credentials");
    return user;
  }

  private async generateToken(user: UserModel) {
    const { username, id, user_type } = user;
    return this.#token?.encrypt({
      username,
      id,
      user_type,
    });
  }

  execute: IAuthUserExecute = async ({ username, password }) => {
    this.initInstances();

    this.#console.log(`Iniciando autenticação do usuário ${username}`);
    const user = await this.checkExists(username);

    await this.comparePassword(password, user.password);

    const token = await this.generateToken(user);
    this.#console.log(`Usuário logado com sucesso\n`);

    return {
      id: user?.id,
      user_type: user?.user_type,
      username: user?.username,
      token,
    };
  };
}
