import { IAppDate, IBaseRepository, IBaseUseCases } from "@root/domain";
import { SchedulingModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";

export class GetSchedulingsPendingUseCase implements IBaseUseCases {
  #date: IAppDate;
  #baseRepo: IBaseRepository;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  private async getSchedulingsDate(
    pivot_id: string
  ): Promise<SchedulingModel[]> {
    return (await this.#baseRepo.findAllByData(DB_TABLES.SCHEDULINGS, {
      OR: [
        {
          pivot_id,
          type: "STOP_DATE",
          end_timestamp: { gte: new Date() },
        },
        {
          pivot_id,
          type: "FULL_DATE",
          start_timestamp: { gte: new Date() },
        },
      ],
    })) as unknown as SchedulingModel[];
  }

  private async getSchedulingsAngle(
    pivot_id: string
  ): Promise<SchedulingModel[]> {
    return (await this.#baseRepo.findAllByData(DB_TABLES.SCHEDULINGS, {
      OR: [
        {
          pivot_id,
          type: "STOP_ANGLE",
          status: "PENDING",
        },
        {
          pivot_id,
          type: "FULL_ANGLE",
          start_timestamp: { gte: new Date() },
        },
      ],
    })) as unknown as SchedulingModel[];
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
        ? await this.getSchedulingsAngle(pivot_id)
        : await this.getSchedulingsDate(pivot_id);

    const notDate = "Nenhuma data encontrada";

    return schedulings.map((sch) => ({
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
