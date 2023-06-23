import {
  AddUserIntoFarmUseCase,
  CreateFarmUseCase,
  DeleteFarmUseCase,
  GetAllFarmsByDealerUseCase,
  GetAllFarmsByUserUseCase,
  GetAllFarmsUseCase,
  GetOneFarmUseCase,
  GetUsersOfFarmUseCase,
  UpdateFarmUseCase,
} from "@root/data/usecases";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES } from "@root/shared";

export const injectFarmCases = async () => {
  Injector.add(new CreateFarmUseCase(), INJECTOR_CASES.FARMS.CREATE);
  Injector.add(new DeleteFarmUseCase(), INJECTOR_CASES.FARMS.DELETE);
  Injector.add(new UpdateFarmUseCase(), INJECTOR_CASES.FARMS.PUT);
  Injector.add(new AddUserIntoFarmUseCase(), INJECTOR_CASES.FARMS.ADD_USER);

  Injector.add(new GetAllFarmsUseCase(), INJECTOR_CASES.FARMS.GET_ALL);
  Injector.add(
    new GetAllFarmsByDealerUseCase(),
    INJECTOR_CASES.FARMS.GET_BY_DEALER
  );

  Injector.add(new GetOneFarmUseCase(), INJECTOR_CASES.FARMS.GET_ONE);
  Injector.add(new GetUsersOfFarmUseCase(), INJECTOR_CASES.FARMS.GET_USERS);
  Injector.add(
    new GetAllFarmsByUserUseCase(),
    INJECTOR_CASES.FARMS.GET_BY_USER
  );
};
