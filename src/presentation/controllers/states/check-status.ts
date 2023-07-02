import { IBaseController, IBaseUseCases } from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CheckAllStatusController
  implements IBaseController<{ pivots: PivotModel[] }>
{
  handle: IBaseController<{ pivots: PivotModel[] }>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      console.log("Controller buscando pivos");
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.STATES.CHECK_ALL_STATUS
      ).execute({ pivots: request.body.pivots });
    };

    return await controllerAdapter({ response, callback, next });
  };
}
