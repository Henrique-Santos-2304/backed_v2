import { IAppDate, IBaseUseCases } from "@root/domain";
import { ISchedulingRepo } from "@root/domain/repos";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";

export class GetSchedulingsPendingUseCase implements IBaseUseCases {
  #schedulingRepo: ISchedulingRepo;
  #date: IAppDate;
  private initInstances() {
    this.#schedulingRepo = Injector.get(INJECTOR_REPOS.SCHEDULINGS);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  execute = async ({
    pivot_id,
    type,
  }: {
    pivot_id: string;
    type: "date" | "angle";
  }): Promise<any> => {
    this.initInstances();

    const schedulings =
      type === "angle"
        ? await this.#schedulingRepo.angles(pivot_id)
        : await this.#schedulingRepo.dates(pivot_id);

    console.log(schedulings);

    const notDate = "Nenhuma data encontrada";

    return schedulings
      .filter((sch) => {
        const isStopAndAfter =
          sch.is_stop && this.#date.dateIsAter(new Date(), sch.end_timestamp!);
        const startDateAndAfter =
          sch.start_timestamp &&
          this.#date.dateIsAter(new Date(), sch.start_timestamp);

        return !isStopAndAfter && !startDateAndAfter;
      })
      .map((sch) => ({
        ...sch,
        start_timestamp: sch?.start_timestamp
          ? this.#date.toDateSpString(sch?.start_timestamp)
          : notDate,
        end_timestamp: sch?.end_timestamp
          ? this.#date.toDateSpString(sch?.end_timestamp)
          : "",
        timestamp: sch?.timestamp
          ? this.#date.toDateSpString(sch?.timestamp)
          : notDate,
      }));
  };
}
