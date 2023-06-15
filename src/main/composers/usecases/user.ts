import { baseRepo } from "../repos/base";

import {
  AuthUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUserUseCase,
  UpdateUserUseCase,
} from "@usecases/index";
import { encrypterService, tokenService, uuidService } from "../validators";

export const createUserUC = new CreateUserUseCase(
  baseRepo,
  uuidService,
  tokenService,
  encrypterService
);

export const authUserUC = new AuthUseCase(
  baseRepo,
  encrypterService,
  tokenService
);

export const putUserUC = new UpdateUserUseCase(
  baseRepo,
  uuidService,
  encrypterService,
  tokenService
);

export const delUserUC = new DeleteUserUseCase(baseRepo);
export const getAllUserUC = new GetAllUserUseCase(baseRepo);
