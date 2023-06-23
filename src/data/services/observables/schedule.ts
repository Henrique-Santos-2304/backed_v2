import { IIotConnect, IObservables, ScheduleStub } from "@root/domain";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

export class CreateScheduleObservable implements IObservables {
  #scheduleSub: ScheduleStub[] = [];

  async dispatch(message: string) {
    console.log(this.#scheduleSub);
    const [idp, pivot_id, id_board] = message.split("-");
    // Remover agendamento do banco de dados
    const listener = this.check(pivot_id, idp);

    if (!listener) return;

    this.unsubscribe(pivot_id, idp);

    listener.cb(false, message);
  }

  check(pivot_id: string, idp: string) {
    return this.#scheduleSub.find(
      (p) => p.idp === idp && p.pivot_id === pivot_id
    );
  }

  private async send(stub: ScheduleStub) {
    await Injector.get<IIotConnect>(INJECTOR_COMMONS.IOT_CONFIG).publisher(
      stub?.pivot_id,
      stub?.message
    );

    console.log(stub?.message);

    setTimeout(() => {
      this.checkListener(stub);
    }, 5000);
  }

  private checkListener(stub: ScheduleStub) {
    const actualList = this.check(stub?.pivot_id, stub?.idp);
    if (!actualList) return;

    if (stub.attempts >= 3) {
      this.unsubscribe(stub?.pivot_id, stub?.idp);
      actualList.cb(true);
      return;
    }
    this.send({ ...stub, attempts: stub?.attempts + 1 });
  }

  subscribe(data: ScheduleStub) {
    this.#scheduleSub = [
      ...this.#scheduleSub.filter(
        (p) => p.idp !== data.idp && p.pivot_id !== data.pivot_id
      ),
      data,
    ];

    this.send(data);
  }

  unsubscribe(pivot_id: string, idp: string) {
    this.#scheduleSub = [
      ...this.#scheduleSub.filter(
        (p) => p.idp !== idp && p.pivot_id !== pivot_id
      ),
    ];
  }
}
