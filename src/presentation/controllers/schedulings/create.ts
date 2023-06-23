import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { RequestScheduleCreate } from "@contracts/usecases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CreateScehdulingController
  implements IBaseController<RequestScheduleCreate>
{
  handle: IBaseController<RequestScheduleCreate>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.CREATE
      ).execute(request.body);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
