import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { UserModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class AuthUserController
  implements IBaseController<Pick<UserModel, "login" | "password">>
{
  handle: IBaseController<Pick<UserModel, "login" | "password">>["handle"] =
    async (request, response, next) => {
      const callback = async () => {
        return await Injector.get<IBaseUseCases>(
          INJECTOR_CASES.USERS.AUTH
        ).execute(request.body);
      };

      return await controllerAdapter({ response, callback, next });
    };
}
