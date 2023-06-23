import { RepositoryAdapterType } from "@contracts/main";
import { IAppLog } from "@root/domain";
import { INJECTOR_COMMONS } from "@root/shared";
import { Injector } from "../injector";

const repositoryAdapter: RepositoryAdapterType = async ({
  columnName,
  callback,
}) => {
  try {
    return await callback();
  } catch (error) {
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
      "Erro banco de dados na tabela " + columnName
    );
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(error.message);
  }
};

export { repositoryAdapter };
