import { console } from "@main/composers";
import { ControllerAdapterType } from "@contracts/main";

export const controllerAdapter: ControllerAdapterType = async ({
  callback,
  response,
  next,
}) => {
  try {
    const res = await callback();
    return response.status(200).json(res);
  } catch (error) {
    console.warn(`Erro ao precessar requisição... Controler!!`);
    console.error(`${error.message}\n`);

    return response.status(400).json({
      error: error.message,
    });
  }
};
