import { IAppLog, IObservables } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

export class GatewayComunicattionObservable implements IObservables {
  #subscriptables: { idp: string; pivot_id: string }[] = [];
  #console: IAppLog;

  private unsubscribe(idp: string, pivot_id: string) {
    this.#subscriptables.filter(
      (sub) => sub.idp !== idp && sub.pivot_id !== pivot_id
    );
  }

  private check(idp: string, pivot_id: string) {
    return this.#subscriptables.find(
      (sub) => sub.idp === idp && sub.pivot_id === pivot_id
    );
  }

  private listener(idp: string, pivot_id: string) {
    setTimeout(() => {
      const exists = this.check(idp, pivot_id);

      if (!exists) return;

      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
        `ACK não recebido para o pivô ${pivot_id}, IDP -> ${idp}`
      );
    }, 60000);
  }

  async dispatch(idp: string, pivot_id: string, cb: () => void) {
    const exists = this.check(idp, pivot_id);

    if (!exists) return;

    this.#console.log(`ACK Recebido para pivô ${pivot_id}, IDP -> ${idp}`);
    this.unsubscribe(idp, pivot_id);
    cb();
  }

  subscribe(idp: string, pivot_id: string) {
    const exists = this.check(idp, pivot_id);

    if (exists) return;

    this.#subscriptables.push({ idp, pivot_id });
    this.listener(idp, pivot_id);
  }
}
