import { INJECTOR_CONTROLS } from "@root/shared";
import { Injector } from "@root/main/injector";
import {
  AllUserController,
  AuthUserController,
  CreateUserController,
  DelUserController,
  PutUserController,
} from "@controllers/index";

export const injectUsersControls = async () => {
  Injector.add(new CreateUserController(), INJECTOR_CONTROLS.USERS.CREATE);
  Injector.add(new AuthUserController(), INJECTOR_CONTROLS.USERS.AUTH);
  Injector.add(new PutUserController(), INJECTOR_CONTROLS.USERS.PUT);
  Injector.add(new DelUserController(), INJECTOR_CONTROLS.USERS.DELETE);
  Injector.add(new AllUserController(), INJECTOR_CONTROLS.USERS.GET_ALL);
};
