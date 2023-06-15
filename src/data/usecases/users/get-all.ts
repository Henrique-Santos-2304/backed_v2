import { IBaseRepository } from "@root/domain";
import { DB_TABLES } from "@root/shared";
import { console } from "@main/composers";

export class GetAllUserUseCase {
  constructor(private baseRepo: IBaseRepository) {}

  async execute() {
    console.log("Iniciando busca de todos os usuários");
    const users = await this.baseRepo.findAll({ column: DB_TABLES.USERS });
    console.log("Busca finalizada\n");
    return users || [];
  }
}
