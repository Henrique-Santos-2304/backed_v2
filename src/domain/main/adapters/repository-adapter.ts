import { DbTables } from "@contracts/repos";

type RepositoryAdapterParams<R = any> = {
  columnName: string;
  callback: () => Promise<R>;
};

type RepositoryAdapterType<R = any> = ({
  columnName,
  callback,
}: RepositoryAdapterParams) => Promise<R>;

export { RepositoryAdapterParams, RepositoryAdapterType };
