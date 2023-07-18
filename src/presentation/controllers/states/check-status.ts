import { IBaseController, IBaseUseCases } from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CheckStatusController
  implements IBaseController<{ pivots: PivotModel[] }>
{
  handle: IBaseController<{ pivots: PivotModel[] }>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.STATES.CHECK_STATUS
      ).execute(request.params.id);
    };

    return await controllerAdapter({ response, callback, next });
  };
}
