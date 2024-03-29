import {
  StateVariablesRepo,
  BaseRepository,
  SchedulingRepo,
  StateRepo,
} from "@db/repos";
import { Injector } from "@root/main/injector";
import { INJECTOR_REPOS } from "@root/shared";

export const injectRepos = async () => {
  Injector.add(new BaseRepository(), INJECTOR_REPOS.BASE);
  Injector.add(new StateVariablesRepo(), INJECTOR_REPOS.STATE_VARIABLES);
  Injector.add(new SchedulingRepo(), INJECTOR_REPOS.SCHEDULINGS);
  Injector.add(new StateRepo(), INJECTOR_REPOS.STATE);
};
