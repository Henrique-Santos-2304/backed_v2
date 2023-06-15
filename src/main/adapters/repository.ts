import { RepositoryAdapterType } from "@contracts/main";
import { console } from "@main/composers";

const repositoryAdapter: RepositoryAdapterType = async ({
  columnName,
  callback,
}) => {
  try {
    console.log(`Abrindo conexão com banco de dados na tabela ${columnName}`);
    return await callback();
  } catch (error) {
    console.warn("Erro ao criar registro na tabela" + columnName);
    console.error(error.message);
  }
};

export { repositoryAdapter };
