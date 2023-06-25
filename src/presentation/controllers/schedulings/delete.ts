import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class DelSchedulingController implements IBaseController<void> {
  handle: IBaseController<void>["handle"] = async (request, response, next) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.DELETE
      ).execute({ scheduling_id: request.params.id });
    };
    return await controllerAdapter({ response, callback, next });
  };
}
