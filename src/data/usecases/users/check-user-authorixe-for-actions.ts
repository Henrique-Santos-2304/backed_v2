import { IBaseRepository } from "@root/domain";
import { UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export class CheckUserHaveAuthorize {
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
  }
  async start(user_id: string) {
    this.initInstances();

    const user = await checkDataExists<UserModel>(
      this.#baseRepo?.findOne,
      {
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: user_id!,
      },
      "Usuário",
      true
    );

    if (user?.user_type !== "SUDO") {
      throw new Error("User don't have authorize for this action");
    }
  }
}
