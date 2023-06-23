import { IBaseRepository } from "@root/domain";
import { UserModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export const checkUserExists = async (
  repo: IBaseRepository["findOne"],
  user_id: string,
  exists: boolean = true
): Promise<UserModel> => {
  return await checkDataExists<UserModel>(
    repo,
    {
      column: DB_TABLES.USERS,
      where: "user_id",
      equals: user_id,
    },
    "Usuário",
    exists
  );
};
