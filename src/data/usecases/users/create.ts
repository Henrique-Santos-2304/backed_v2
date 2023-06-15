import { CreateUserDto } from "@db/dto";
import { UserModel } from "@db/models";
import { DB_TABLES } from "@root/shared";
import { MutationUserVO } from "@db/value-objects";
import { ICreateUserExecute } from "@contracts/usecases";
import { checkDataExists } from "@shared/db-helpers";
import { console } from "@main/composers";
import {
  IBaseRepository,
  IBaseUseCases,
  IEncrypt,
  IHashId,
  ITokenValidator,
} from "@root/domain";

export class CreateUserUseCase implements IBaseUseCases {
  constructor(
    private baseRepo: IBaseRepository,
    private uuid: IHashId,
    private token: ITokenValidator,
    private encrypter: IEncrypt
  ) {}

  private async findUser(login: CreateUserDto["login"]): Promise<UserModel> {
    const query = {
      column: DB_TABLES.USERS,
      where: "login",
      equals: login,
    };

    return await checkDataExists<UserModel>(
      this.baseRepo.findOne,
      query,
      "usuário",
      false
    );
  }

  private createEntity = (dto: CreateUserDto): UserModel => {
    const vo = new MutationUserVO(this.uuid, this.encrypter, this.token);
    return vo.create({ ...dto }).find();
  };

  execute: ICreateUserExecute = async (dto) => {
    console.log("Iniciando criação de usuário ");
    await this.findUser(dto?.login);
    const user = this.createEntity(dto);

    const { password, secret, ...restUser } = user;
    const token = this.token.encrypt(restUser);

    await this.baseRepo.create<UserModel>({
      column: DB_TABLES.USERS,
      data: user,
    });

    console.log("Criação de usuário realizada com sucesso \n");
    return { ...restUser, token };
  };
}
