import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { IDelUserExecute } from "@root/domain/usecases";
import { FarmModel, UserModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";
import { checkDataExists } from "@root/shared/db-helpers";
import { console } from "@main/composers";

export class DeleteUserUseCase implements IBaseUseCases {
  constructor(private baseRepo: IBaseRepository) {}

  private async delUser(user_id: string) {
    await this.baseRepo.delete({
      column: DB_TABLES.USERS,
      where: "user_id",
      equals: user_id,
    });
  }

  private async putFarm(farm: FarmModel) {
    await this.baseRepo.update({
      column: DB_TABLES.FARMS,
      where: "farm_id",
      equals: farm?.farm_id,
      data: farm,
    });
  }

  private async getFarmsUserDealer(user_id: string) {
    const farms = await this.baseRepo.findAllByData({
      column: DB_TABLES.FARMS,
      where: "dealer",
      equals: user_id,
    });

    if (farms?.length <= 0) return;

    for (let farm of farms) {
      await this.putFarm({ ...farm, dealer: null });
    }
  }

  private async getFarmsUserWork(user_id: string) {
    const farms = await this.baseRepo.findAll<FarmModel>({
      column: DB_TABLES.FARMS,
    });

    const exist = farms?.filter((u) => u.users?.includes(user_id));

    if (exist?.length <= 0) return;

    for (let farm of exist) {
      await this.putFarm({
        ...farm,
        users: farm?.users?.filter((f) => f !== user_id) || [],
      });
    }
  }

  execute: IDelUserExecute = async (user_id) => {
    console.log("Iniciando deleção de usuário");
    const user = await checkDataExists<UserModel>(
      this.baseRepo.findOne,
      {
        column: DB_TABLES.USERS,
        where: "user_id",
        equals: user_id,
      },
      "Usuário",
      true
    );

    if (user?.user_type === "DEALER") {
      await this.getFarmsUserDealer(user_id);
    }

    await this.getFarmsUserWork(user_id);
    console.log("Finalizando deleção de usuário\n");

    return await this.delUser(user_id);
  };
}
