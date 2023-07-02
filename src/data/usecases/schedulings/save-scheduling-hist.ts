import { IAppLog, IBaseRepository, IBaseUseCases } from "@root/domain";
import { ICreateSchedulingHistExecute } from "@root/domain/usecases";
import { SchedulingModel, UserModel } from "@root/infra/models";
import { MutationScheduleHistVO } from "@root/infra";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { SchedulerSendAction } from "./helpers/send-action";

export class SaveSchedulingHistory implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #console: IAppLog;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#console = Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  private async getUserLogin(author?: string) {
    if (!author) return "";

    const user = await this.#baseRepo.findOne<UserModel>(DB_TABLES.USERS, {
      user_id: author,
    });

    if (!user) this.#console.warn("Author do agendamento não encontrado");
    return user?.login || author || "";
  }

  private createEntity(msg: string[], is_board: boolean, author?: string) {
    const vo = new MutationScheduleHistVO();

    return vo.create(msg, author, is_board).find();
  }

  execute: ICreateSchedulingHistExecute = async ({
    schedule,
    is_board,
    author,
  }) => {
    this.initInstances();

    const entity = this.createEntity(
      schedule,
      is_board,
      await this.getUserLogin(author)
    );

    const scheduling = await this.#baseRepo.create<SchedulingModel>(
      DB_TABLES.SCHEDULINGS,
      entity
    );

    if (!scheduling) {
      this.#console.warn("Erro ao criar agendamento");
      return {} as SchedulingModel;
    }

    if (!is_board) {
      SchedulerSendAction.handleAndInitSchedule(scheduling, schedule);
    }

    return scheduling;
  };
}
