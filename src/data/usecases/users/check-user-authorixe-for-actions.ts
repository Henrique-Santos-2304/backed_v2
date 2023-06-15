import { IBaseRepository } from "@root/domain";
import { UserModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export class CheckUserHaveAuthorize {
  constructor(private readonly baseRepo: IBaseRepository) {}

  private checkUserToHaveAuth(type: UserModel["user_type"]) {}

  async start(user_id: string) {
    const user = await checkDataExists<UserModel>(
      this.baseRepo.findOne,
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
