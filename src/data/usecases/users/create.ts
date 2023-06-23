import { CreateUserDto } from "@db/dto";
import { UserModel } from "@db/models";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { MutationUserVO } from "@db/value-objects";
import { ICreateUserExecute } from "@contracts/usecases";
import { checkDataExists } from "@shared/db-helpers";
import {
  IAppLog,
  IBaseRepository,
  IBaseUseCases,
  IEncrypt,
  IHashId,
  ITokenValidator,
} from "@root/domain";
import { Injector } from "@root/main/injector";

export class CreateUserUseCase implements IBaseUseCases {
  #console: IAppLog;
  #baseRepo: IBaseRepository;
  #encrypter: IEncrypt;
  #token: ITokenValidator;
  #hash: IHashId;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#token = this.#token ?? Injector.get(INJECTOR_COMMONS.APP_TOKEN);
    this.#hash = this.#hash ?? Injector.get(INJECTOR_COMMONS.APP_HASH);

    this.#encrypter =
      this.#encrypter ?? Injector.get(INJECTOR_COMMONS.APP_ENCRYPTER);
  }

  private async findUser(login: CreateUserDto["login"]): Promise<UserModel> {
    const query = {
      column: DB_TABLES.USERS,
      where: "login",
      equals: login,
    };

    return await checkDataExists<UserModel>(
      this.#baseRepo.findOne,
      query,
      "usuário",
      false
    );
  }

  private createEntity = (dto: CreateUserDto): UserModel => {
    const vo = new MutationUserVO(this.#hash, this.#encrypter, this.#token);
    return vo.create({ ...dto }).find();
  };

  execute: ICreateUserExecute = async (dto) => {
    this.initInstances();

    this.#console.log("Iniciando criação de usuário ");
    await this.findUser(dto?.login);
    const user = this.createEntity(dto);

    const { password, secret, ...restUser } = user;
    const token = this.#token?.encrypt(restUser);

    await this.#baseRepo.create<UserModel>({
      column: DB_TABLES.USERS,
      data: user,
    });

    this.#console.log("Criação de usuário realizada com sucesso \n");
    return { ...restUser, token };
  };
}
