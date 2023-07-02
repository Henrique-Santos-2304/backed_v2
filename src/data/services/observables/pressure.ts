import { IObservables } from "@root/domain";

export class PressureObservable implements IObservables {
  #pivotsPressure: string[] = [];

  check(pivot_id: string) {
    return this.#pivotsPressure.find((p) => p === pivot_id);
  }

  unsubscribe(pivot_id: string) {
    this.#pivotsPressure = this.#pivotsPressure.filter((p) => p !== pivot_id);
  }

  subscribe(pivot_id: string): void {
    this.#pivotsPressure.push(pivot_id);
  }

  async dispatch(pivot_id: any): Promise<void> {
    const exists = this.check(pivot_id);

    if (exists) {
      console.log("Pivô já está pressurizando ");
    }

    this.subscribe(pivot_id);
    return;
  }
}
