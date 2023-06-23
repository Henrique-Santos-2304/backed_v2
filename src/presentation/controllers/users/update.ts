import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { UserModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class PutUserController implements IBaseController<UserModel> {
  handle: IBaseController<UserModel>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases<void>>(
        INJECTOR_CASES.USERS.PUT
      ).execute(request.body);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
