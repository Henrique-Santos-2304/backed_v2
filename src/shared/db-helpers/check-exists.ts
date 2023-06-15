import { IBaseRepository } from "@root/domain";
import { IQueryFindBase } from "@contracts/repos";

export const checkDataExists = async <Type = any>(
  repo: IBaseRepository["findOne"],
  condition: IQueryFindBase,
  dataError: string,
  hasExist?: boolean
) => {
  const exists = await repo<Type>(condition);

  if (hasExist && !exists) throw new Error(`${dataError} não existe`);
  if (!hasExist && exists) throw new Error(`${dataError} já existe`);

  return exists;
};
