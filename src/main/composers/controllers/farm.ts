import {
  AllFarmsController,
  CreateFarmController,
  DelFarmController,
  OneFarmController,
  PutFarmController,
} from "@root/presentation/controllers";

import { INJECTOR_CONTROLS } from "@root/shared";
import { Injector } from "@root/main/injector";

export const injectFarmControls = async () => {
  Injector.add(new CreateFarmController(), INJECTOR_CONTROLS.FARMS.CREATE);
  Injector.add(new DelFarmController(), INJECTOR_CONTROLS.FARMS.DELETE);
  Injector.add(new PutFarmController(), INJECTOR_CONTROLS.FARMS.PUT);

  Injector.add(new AllFarmsController(), INJECTOR_CONTROLS.FARMS.GET_ALL);
  Injector.add(new OneFarmController(), INJECTOR_CONTROLS.FARMS.GET_ONE);
};
