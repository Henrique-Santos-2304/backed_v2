import { IBaseController, IBaseUseCases } from "@root/domain";
import { ActionProps } from "@root/domain/usecases";
import { controllerAdapter } from "@root/main";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CreateActionController implements IBaseController<ActionProps> {
  handle: IBaseController<ActionProps>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.STATES.ACTION
      ).execute({ action: request.body?.data });
    };

    return await controllerAdapter({ response, callback, next });
  };
}
