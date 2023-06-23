import { IBaseRepository } from "@root/domain";
import { SchedulingModel } from "@root/infra/models";
import { DB_TABLES } from "@root/shared";

export const checkSchedulingExist = async (
  repo: IBaseRepository["findOne"],
  scheduling_id: SchedulingModel["scheduling_id"],
  exist: boolean = true
): Promise<SchedulingModel> => {
  const scheduling = await repo<SchedulingModel>({
    column: DB_TABLES.SCHEDULINGS,
    where: "scheduling_id",
    equals: scheduling_id,
  });

  if (exist && !scheduling) throw new Error("Agendamento não encontrado");
  if (!exist && scheduling) throw new Error("Agendamento encontrado");

  return scheduling;
};
