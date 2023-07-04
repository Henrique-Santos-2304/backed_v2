import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { UserModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class UserOfFarmController implements IBaseController<UserModel[]> {
  handle: IBaseController<UserModel[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.FARMS.GET_USERS
      ).execute(request.params.id);
    };

    return await controllerAdapter({ response, callback, next });
  };
}
