import { prisma } from "@root/core";

export type QueryWhereCondition = {
  where: string;
  equals: string;
};

export type DbTables =
  | "user"
  | "farm"
  | "pivot"
  | "state"
  | "cycle"
  | "connection"
  | "stateVariable"
  | "radioVariable"
  | "scheduling";

export type ConstantsType = {
  USERS: "user";
  FARMS: "farm";
  PIVOTS: "pivot";
  STATES: "state";
  CYCLES: "cycle";
  CONNECTIONS: "connection";
  STATE_VARIABLES: "stateVariable";
  RADIO_VARIABLES: "radioVariable";
  SCHEDULINGS: "scheduling";
};

export type IQueryFindBase = { column: DbTables } & QueryWhereCondition;

export type IQueryFindAllBase = Pick<IQueryFindBase, "column">;
export type IQueryCreateBase<P> = { data: P } & Pick<IQueryFindBase, "column">;
export type IQueryUpdateBase<P> = QueryWhereCondition & IQueryCreateBase<P>;
export type IQueryDeleteBase = IQueryFindBase;
export type IQueryDeleteALLBase = IQueryFindAllBase;
