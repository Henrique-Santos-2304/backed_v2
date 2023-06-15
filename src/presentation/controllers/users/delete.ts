import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { controllerAdapter } from "@root/main/adapters";

export class DelUserController implements IBaseController<string> {
  constructor(private useCase: IBaseUseCases) {}

  handle: IBaseController<string>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => await this.useCase.execute(request.params?.id);
    return await controllerAdapter({ response, callback, next });
  };
}
