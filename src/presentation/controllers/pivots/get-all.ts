import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { GetPivotFullResponse } from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class GetAllPivotController implements IBaseController<PivotModel> {
  handle: IBaseController<PivotModel>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.GET_ALL
      ).execute(request.params.id);
    };

    return await controllerAdapter({ response, callback, next });
  };
}

export class GetAllPivotFullController
  implements IBaseController<GetPivotFullResponse[]>
{
  handle: IBaseController<GetPivotFullResponse[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      const service = await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.GET_ALL_FULL
      );
      return service?.execute(request.params.id);
    };

    return await controllerAdapter({ response, callback, next });
  };
}
