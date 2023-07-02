import { IBaseRepository } from "@root/domain";
import { SchedulingModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export const checkSchedulingExist = async (
  scheduling_id: SchedulingModel["scheduling_id"],
  exist: boolean = true
): Promise<SchedulingModel> => {
  const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
  const scheduling = await baseRepo.findOne<SchedulingModel>(
    DB_TABLES.SCHEDULINGS,
    { scheduling_id }
  );

  if (exist && !scheduling) throw new Error("Agendamento não encontrado");
  if (!exist && scheduling) throw new Error("Agendamento encontrado");

  return scheduling;
};
