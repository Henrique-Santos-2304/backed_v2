import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { PivotModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class UpdatePivotController implements IBaseController<PivotModel> {
  handle: IBaseController<PivotModel>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return Injector.get<IBaseUseCases>(INJECTOR_CASES.PIVOTS.PUT).execute({
        pivot: request.body,
      });
    };
    return await controllerAdapter({ response, callback, next });
  };
}
