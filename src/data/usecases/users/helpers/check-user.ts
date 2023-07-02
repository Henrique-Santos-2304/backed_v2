import { IBaseRepository } from "@root/domain";
import { UserModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";

export const checkUserExists = async (
  where: Partial<UserModel>,
  exists: boolean = true
): Promise<UserModel> => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  const user = await baseRepo.findOne<UserModel>(DB_TABLES.USERS, where);
  if (exists && !user) throw new Error("Usuario não encontrado");
  if (!exists && user) throw new Error("Usuario já existe");

  return user;
};
