export type QueryWhereCondition = {
  where: string;
  equals: string;
};

export type DbTables =
  | "users"
  | "farms"
  | "pivots"
  | "states"
  | "state_variables"
  | "radio_variables"
  | "schedulings"
  | "scheduling_historys";

export type ConstantsType = {
  USERS: "users";
  FARMS: "farms";
  PIVOTS: "pivots";
  STATES: "states";
  STATE_VARIABLES: "state_variables";
  RADIO_VARIABLES: "radio_variables";
  SCHEDULINGS: "schedulings";
};

export type IQueryFindBase = { column: DbTables } & QueryWhereCondition;

export type IQueryFindAllBase = Pick<IQueryFindBase, "column">;
export type IQueryCreateBase<P> = { data: P } & Pick<IQueryFindBase, "column">;
export type IQueryUpdateBase<P> = QueryWhereCondition & IQueryCreateBase<P>;
export type IQueryDeleteBase = IQueryFindBase;
export type IQueryDeleteALLBase = IQueryFindAllBase;
