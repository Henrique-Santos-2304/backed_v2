import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { UserModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";

export class AuthUserController
  implements IBaseController<Pick<UserModel, "login" | "password">>
{
  constructor(private useCase: IBaseUseCases) {}

  handle: IBaseController<Pick<UserModel, "login" | "password">>["handle"] =
    async (request, response, next) => {
      const callback = async () => await this.useCase.execute(request.body);
      return await controllerAdapter({ response, callback, next });
    };
}
