import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { CreateFarmDto } from "@root/infra/dto";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class CreateFarmController implements IBaseController<CreateFarmDto> {
  handle: IBaseController<CreateFarmDto>["handle"] = async (
    request,
    response,
    next
  ) => {
    const callback = async () => {
      return await Injector.get<IBaseUseCases>(
        INJECTOR_CASES.FARMS.CREATE
      ).execute(request.body);
    };
    return await controllerAdapter({ response, callback, next });
  };
}
