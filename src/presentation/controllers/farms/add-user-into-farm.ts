import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { IAddUserFarmType } from "@contracts/usecases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class AddUserFarmController
  implements IBaseController<IAddUserFarmType>
{
  handle: IBaseController<IAddUserFarmType>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.FARMS.ADD_USER
      ).execute(request.body);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
