import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { ICreateUserResponse } from "@contracts/usecases";
import { controllerAdapter } from "@root/main/adapters";

export class CreateUserController
  implements IBaseController<ICreateUserResponse>
{
  constructor(private useCase: IBaseUseCases) {}

  handle: IBaseController<ICreateUserResponse>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => await this.useCase.execute(request.body);
    return await controllerAdapter({ response, callback, next });
  };
}
