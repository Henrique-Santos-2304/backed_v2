import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class DelUserController implements IBaseController<string> {
  handle: IBaseController<string>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.USERS.DELETE
      ).execute(request.params.id);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
