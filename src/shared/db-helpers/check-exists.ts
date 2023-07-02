import { IBaseRepository } from "@root/domain";
import { DbTables } from "@contracts/repos";

export const checkDataExists = async <Type = any>(
  repo: IBaseRepository["findOne"],
  column: DbTables,
  condition: Partial<Type>,
  dataError: string,
  hasExist?: boolean
) => {
  const exists = await repo<Type>(column, condition);
  console.log("Em exists", exists);
  if (hasExist && !exists) throw new Error(`${dataError} não existe`);
  if (!hasExist && exists) throw new Error(`${dataError} já existe`);

  return exists;
};
