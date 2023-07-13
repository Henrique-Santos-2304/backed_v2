import {
  AngleSubscribe,
  IBaseRepository,
  IObservables,
  ObservableAngleType,
} from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_REPOS } from "@root/shared";

export class AngleJobObservable implements IObservables {
  #schedules: ObservableAngleType[] = [];

  private check(pivot_id: string, angle: number) {
    return this.#schedules.find((p) => {
      const pivotEquals = p.pivot_id === pivot_id;
      const angleValid =
        p.type === "cresc"
          ? angle >= p.requiredAngle
          : angle <= p.requiredAngle;

      return pivotEquals && angleValid;
    });
  }

  async dispatch(pivot_id: string, angle: number) {
    const action = this.check(pivot_id, angle);
    if (!action) return;

    this.unsubscribe(pivot_id, action?.requiredAngle);
    action.cb();
  }

  unsubscribe(pivot_id: string, angle: number) {
    this.#schedules = this.#schedules.filter(
      (p) => p.pivot_id !== pivot_id && angle === p.requiredAngle
    );
  }

  subscribe: IObservables<AngleSubscribe>["subscribe"] = async ({
    pivot_id,
    requiredAngle,
    cb,
  }) => {
    const baseRepo = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
    const piv = await baseRepo.findOne<PivotModel>(DB_TABLES.PIVOTS, {
      id: pivot_id,
    });

    this.#schedules = [
      ...this.#schedules.filter((sc) => sc.pivot_id === pivot_id),
      {
        pivot_id,
        requiredAngle,
        type: piv?.init_angle > requiredAngle ? "desc" : "cresc",
        cb,
      },
    ];
  };
}
