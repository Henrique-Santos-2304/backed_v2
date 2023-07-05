import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { FarmModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class AllFarmsController implements IBaseController<FarmModel[]> {
  handle: IBaseController<FarmModel[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases<string>>(
        INJECTOR_CASES.FARMS.GET_ALL
      ).execute(request.params.id);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
