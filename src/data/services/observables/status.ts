import { IObservables, StatusObservablesType } from "@root/domain";

export class StatusObservable implements IObservables {
  #observers: Array<StatusObservablesType> = [] as StatusObservablesType[];

  private check(id: string) {
    return this.#observers.find((sub) => sub?.pivot?.id === id);
  }

  subscribe(sub: StatusObservablesType) {
    const exist = this.check(sub?.pivot.id);
    if (exist) return;

    this.#observers.push(sub);

    this.send(sub);
  }

  unsubscribe(follow: string) {
    this.#observers = this.#observers.filter(
      (sub) => sub?.pivot?.id !== follow
    );
  }

  private checkListener(stub: StatusObservablesType) {
    const actualList = this.check(stub?.pivot?.id);
    if (!actualList) return;

    if (stub?.attempts >= 3) {
      this.unsubscribe(stub?.pivot?.id);
      stub?.cbFail(stub?.pivot);
      return;
    }

    this.send({ ...stub, attempts: stub?.attempts + 1 });
  }

  async send(sub: StatusObservablesType) {
    sub?.iot(sub.pivot);

    setTimeout(() => {
      this.checkListener(sub);
    }, 5000);
  }

  async dispatch(follow: string) {
    const exist = this.check(follow);

    if (!exist) return;

    this.unsubscribe(follow);
  }
}
