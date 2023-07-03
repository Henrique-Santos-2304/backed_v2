import { UserModel } from "../models";
import { CreateUserDto } from "@db/dto";
import { IHashId, IEncrypt, ITokenValidator } from "@contracts/index";

export class MutationUserVO {
  #user: UserModel;

  constructor(
    private uuidGenerator: IHashId,
    private encrypt: IEncrypt,
    private jwt: ITokenValidator
  ) {
    this.#user = new UserModel();
  }

  private checkDataEquals(oldData: UserModel, newData: UserModel) {
    const passwordEquals = oldData.password === newData.password;
    const loginEquals = oldData.username === newData.username;
    const userTypeEquals = oldData.user_type === newData.user_type;

    return {
      equals: loginEquals && passwordEquals && userTypeEquals,
      isPassword: passwordEquals,
    };
  }

  create(user: CreateUserDto) {
    this.#user.user_id = this.uuidGenerator.generate();
    this.#user = { ...this.#user, ...user };
    this.#user.secret = this.jwt.encrypt(user.password);

    this.#user.password = this.encrypt.encrypt(user.password);

    return this;
  }

  update(oldUser: UserModel, newUser: UserModel) {
    this.#user = oldUser;

    const { equals, isPassword } = this.checkDataEquals(oldUser, newUser);

    if (equals) throw new Error("Data is equals");

    if (!isPassword) {
      this.#user.password = this.encrypt?.encrypt(newUser?.password);
      this.#user.secret = this.jwt.encrypt(newUser?.password);
    }

    this.#user.username = newUser.username;
    this.#user.user_type = newUser?.user_type;

    return this;
  }

  find = () => this.#user;
}
