import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { CreatePivotDto } from "@root/infra/dto";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CreatePivotController implements IBaseController<CreatePivotDto> {
  handle: IBaseController<CreatePivotDto>["handle"] = async (
    request,
    response,
    next
  ) => {
    console.log("request");
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.PIVOTS.CREATE
      ).execute({ pivot: request.body });
    };

    return await controllerAdapter({ response, callback, next });
  };
}
