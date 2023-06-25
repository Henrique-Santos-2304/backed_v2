import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { RequestScheduleCreate } from "@contracts/usecases";
import { SchedulingModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class GetSchedulingsByDateController
  implements IBaseController<SchedulingModel[]>
{
  handle: IBaseController<SchedulingModel[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.GET_ALL
      ).execute({
        pivot_id: request.params.id,
        type: "date",
      });
    };
    return await controllerAdapter({ response, callback, next });
  };
}

export class GetSchedulingsByAngleController
  implements IBaseController<SchedulingModel[]>
{
  handle: IBaseController<SchedulingModel[]>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.GET_ALL
      ).execute({
        pivot_id: request.params.id,
        type: "angle",
      });
    };
    return await controllerAdapter({ response, callback, next });
  };
}
