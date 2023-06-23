import { IBaseController, IBaseUseCases } from "@contracts/bases";
import { controllerAdapter } from "@root/main/adapters";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export class SendRadioVariableController
  implements IBaseController<{ pivot_id: string; type: string }>
{
  handle: IBaseController<{ pivot_id: string; type: string }>["handle"] =
    async (request, response, next) => {
      const callback = async () => {
        return await Injector.get<IBaseUseCases>(
          INJECTOR_CASES.RADIO_VARIABLES.SEND
        ).execute({ ...request.body });
      };

      return await controllerAdapter({ response, callback, next });
    };
}
