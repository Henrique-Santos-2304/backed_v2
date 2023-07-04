import { IBaseRepository } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_REPOS } from "@root/shared";
import { checkUserExists } from "./helpers";

export class CheckUserHaveAuthorize {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }
  async start(id: string) {
    this.initInstances();

    const user = await checkUserExists({ id });

    if (user?.user_type !== "SUDO") {
      throw new Error("User don't have authorize for this action");
    }
  }
}
