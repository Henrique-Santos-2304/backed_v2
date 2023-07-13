import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { GetPivotFullResponse } from "@root/domain/usecases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class GetPivotFullController
  implements IBaseController<GetPivotFullResponse>
{
  handle: IBaseController<GetPivotFullResponse>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.GET_ONE
      ).execute(request.params.id);
    };

    return await controllerAdapter({ response, callback, next });
  };
}
