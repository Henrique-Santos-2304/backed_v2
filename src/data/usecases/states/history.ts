import { Injector } from "@root/main/injector";
import { CycleResponseType, IStateRepo } from "@root/domain/repos";
import { checkPivotExist } from "../pivots/helpers";
import { IAppDate, IBaseUseCases } from "@root/domain";
import { INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { IGetStateHistoryExec } from "@root/domain/usecases";

export class GetHistoryStateOfPivot implements IBaseUseCases {
  #appDate: IAppDate;
  #state: IStateRepo;

  private initInstances() {
    this.#appDate = Injector.get(INJECTOR_COMMONS.APP_DATE);
    this.#state = Injector.get(INJECTOR_REPOS.STATE);
  }

  execute: IGetStateHistoryExec = async ({
    pivot_id,
    start_date,
    end_date,
  }) => {
    this.initInstances();

    await checkPivotExist(pivot_id);

    const startDate = this.#appDate.handleDateToHistories(start_date, 0);
    const endDate = this.#appDate.handleDateToHistories(end_date, 24);

    const states = await this.#state.getCycles(pivot_id, startDate, endDate);

    const listState = states.map((s) => ({
      status: s.status,
      start_date: this.#appDate.toDateSpString(s.start_date),
      end_date: s.end_date ? this.#appDate.toDateSpString(s.end_date) : null,
      is_off: s.is_off,
      id: s.id,
      pivot_id: s.pivot_id,
      cycles: s.cycles?.map((c) => c.status),
      variables: s.variables?.map((v) => ({
        angle: v.angle,
        percentimeter: v.percentimeter,
        timestamp: this.#appDate.toDateSpString(v.timestamp),
      })),
    }));

    return listState as unknown as Partial<CycleResponseType>[];
  };
}
