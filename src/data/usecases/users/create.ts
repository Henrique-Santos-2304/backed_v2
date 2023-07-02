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
import { checkUserExists } from "./helpers";

export class CreateUserUseCase implements IBaseUseCases {
  #console: IAppLog;
  #baseRepo: IBaseRepository;
  #encrypter: IEncrypt;
  #token: ITokenValidator;
  #hash: IHashId;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);

    this.#token = Injector.get(INJECTOR_COMMONS.APP_TOKEN);
    this.#hash = Injector.get(INJECTOR_COMMONS.APP_HASH);

    this.#encrypter = Injector.get(INJECTOR_COMMONS.APP_ENCRYPTER);
  }

  private createEntity = (dto: CreateUserDto): UserModel => {
    const vo = new MutationUserVO(this.#hash, this.#encrypter, this.#token);
    return vo.create({ ...dto }).find();
  };

  execute: ICreateUserExecute = async (dto) => {
    this.initInstances();

    this.#console.log("Iniciando criação de usuário ");
    await checkUserExists({ login: dto?.login }, false);
    const user = this.createEntity(dto);

    const { password, secret, ...restUser } = user;
    const token = this.#token?.encrypt(restUser);

    await this.#baseRepo.create<UserModel>(DB_TABLES.USERS, user);

    this.#console.log("Criação de usuário realizada com sucesso \n");
    return { ...restUser, token };
  };
}
