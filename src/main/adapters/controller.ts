import { ControllerAdapterType } from "@contracts/main";
import { Injector } from "../injector";
import { IAppLog } from "@root/domain";
import { INJECTOR_COMMONS } from "@root/shared";

export const controllerAdapter: ControllerAdapterType = async ({
  callback,
  response,
  next,
}) => {
  try {
    const res = await callback();
    return response.status(200).json(res);
  } catch (error) {
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
      `Erro ao precessar requisição... Controler!!`
    );
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
      `${error.message}\n`
    );

    return response.status(400).json({
      error: error.message,
    });
  }
};
