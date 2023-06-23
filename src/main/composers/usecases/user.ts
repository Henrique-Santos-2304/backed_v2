import {
  AuthUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUserUseCase,
  UpdateUserUseCase,
} from "@usecases/index";

import { INJECTOR_CASES } from "@root/shared";
import { Injector } from "@root/main/injector";

export const injectUsersCases = async () => {
  Injector.add(new CreateUserUseCase(), INJECTOR_CASES.USERS.CREATE);
  Injector.add(new AuthUseCase(), INJECTOR_CASES.USERS.AUTH);
  Injector.add(new UpdateUserUseCase(), INJECTOR_CASES.USERS.PUT);
  Injector.add(new DeleteUserUseCase(), INJECTOR_CASES.USERS.DELETE);
  Injector.add(new GetAllUserUseCase(), INJECTOR_CASES.USERS.GET_ALL);
};
