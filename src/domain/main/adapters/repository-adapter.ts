import { DbTables } from "@contracts/repos";

type RepositoryAdapterParams<R = any> = {
  columnName: DbTables;
  callback: () => Promise<R>;
};

type RepositoryAdapterType<R = any> = ({
  columnName,
  callback,
}: RepositoryAdapterParams) => Promise<R>;

export { RepositoryAdapterParams, RepositoryAdapterType };
