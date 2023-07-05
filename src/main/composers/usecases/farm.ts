import {
  AddUserIntoFarmUseCase,
  CreateFarmUseCase,
  DelUserIntoFarmUseCase,
  DeleteFarmUseCase,
  GetAllFarmsUseCase,
  GetOneFarmUseCase,
  UpdateFarmUseCase,
} from "@root/data/usecases";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export const injectFarmCases = async () => {
  Injector.add(new CreateFarmUseCase(), INJECTOR_CASES.FARMS.CREATE);
  Injector.add(new DeleteFarmUseCase(), INJECTOR_CASES.FARMS.DELETE);
  Injector.add(new UpdateFarmUseCase(), INJECTOR_CASES.FARMS.PUT);
  Injector.add(new AddUserIntoFarmUseCase(), INJECTOR_CASES.FARMS.ADD_USER);
  Injector.add(new DelUserIntoFarmUseCase(), INJECTOR_CASES.FARMS.DEL_USER);

  Injector.add(new GetAllFarmsUseCase(), INJECTOR_CASES.FARMS.GET_ALL);
  Injector.add(new GetOneFarmUseCase(), INJECTOR_CASES.FARMS.GET_ONE);
};
