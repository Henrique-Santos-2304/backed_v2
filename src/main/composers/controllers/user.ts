import {
  AuthUserController,
  CreateUserController,
  DelUserController,
  PutUserController,
} from "@controllers/index";
import {
  authUserUC,
  createUserUC,
  delUserUC,
  getAllUserUC,
  putUserUC,
} from "../usecases/user";

export const createUserController = new CreateUserController(createUserUC);
export const authUserController = new AuthUserController(authUserUC);
export const putUserController = new PutUserController(putUserUC);
export const delUserController = new DelUserController(delUserUC);
export const allUserController = new AuthUserController(getAllUserUC);
