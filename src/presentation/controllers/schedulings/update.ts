import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { SchedulingModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class PutSchedulingController
  implements IBaseController<SchedulingModel>
{
  handle: IBaseController<SchedulingModel>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.UPDATE
      ).execute({ schedule: request.body });
    };
    return await controllerAdapter({ response, callback, next });
  };
}
