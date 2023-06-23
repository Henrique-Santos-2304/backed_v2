import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { PivotModel } from "@root/infra/models";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class DelPivotController implements IBaseController<PivotModel> {
  handle: IBaseController<PivotModel>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.DELETE
      ).execute({ pivot_id: request.params?.id });
    };

    return await controllerAdapter({ response, callback, next });
  };
}
