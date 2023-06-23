import { IBaseController, IBaseUseCases } from "@root/domain";
import { PartialCycleResponse } from "@root/domain/usecases";
import { controllerAdapter } from "@root/main";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class GetHistoryCycleController
  implements IBaseController<PartialCycleResponse[]>
{
  handle: IBaseController<PartialCycleResponse[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.STATES.GET_HISTORY
      ).execute({
        pivot_id: request.params.id,
        start_date: request.params.start,
        end_date: request.params?.end,
      });
    };

    return await controllerAdapter({ response, callback, next });
  };
}
