import {
  AngleSubscribe,
  IObservables,
  ObservableAngleType,
} from "@root/domain";

export class AngleJobObservable implements IObservables {
  #schedules: ObservableAngleType[] = [];

  private check(pivot_id: string, angle: number) {
    return this.#schedules.find(
      (p) => p.pivot_id === pivot_id && angle === p.requiredAngle
    );
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

  subscribe: IObservables<AngleSubscribe>["subscribe"] = ({
    pivot_id,
    requiredAngle,
    cb,
  }) => {
    this.#schedules = [...this.#schedules, { pivot_id, requiredAngle, cb }];
  };
}
