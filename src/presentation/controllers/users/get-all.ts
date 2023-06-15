import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { UserModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";

export class AllUserController implements IBaseController<UserModel[]> {
  constructor(private useCase: IBaseUseCases<void>) {}

  handle: IBaseController<UserModel[]>["handle"] = async (
    _,
    response,
    next
  ) => {
    const callback = async () => await this.useCase.execute();
    return await controllerAdapter({ response, callback, next });
  };
}
