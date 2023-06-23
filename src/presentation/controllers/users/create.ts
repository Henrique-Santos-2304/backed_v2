import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { ICreateUserResponse } from "@contracts/usecases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CreateUserController
  implements IBaseController<ICreateUserResponse>
{
  handle: IBaseController<ICreateUserResponse>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.USERS.CREATE
      ).execute(request.body);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
