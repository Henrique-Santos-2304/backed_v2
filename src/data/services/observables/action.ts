import { IAppLog, IObservables } from "@root/domain";
import { Injector } from "@root/main/injector";
import { IDPS, INJECTOR_COMMONS, splitMsgCloud } from "@root/shared";

type Props = {
  timer?: NodeJS.Timeout;
  pivot_id: string;
  idp: string;
  attempts: number;
  author: string;
};

type SubProps = {
  action: string;
  topic: string;
  message: string;
};

export class CreateActionObservable implements IObservables {
  #action: Props[] = [];

  async dispatch(pivot_id: string) {
    console.log("dispatch");
    const find = this.checkByPivot(pivot_id);
    console.log("Finbded ", find);
    this.#action = this.#action.filter((ac) => ac.pivot_id !== pivot_id);
    find?.timer && clearTimeout(find?.timer);
    return find?.author;
  }

  private exclude(pivot_id: string) {
    this.#action = this.#action.filter((ac) => ac.pivot_id !== pivot_id);
  }

  private checkByPivot(pivot_id: string) {
    return this.#action.find((ac) => ac.pivot_id === pivot_id);
  }

  private async checkMessageReceived(
    action: Props,
    topic: string,
    message: string
  ) {
    setTimeout(async () => {
      const console = Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS);
      const exists = this.checkByPivot(action?.pivot_id);

      if (!exists) return;

      if (action?.attempts > 3) {
        console.error(
          `ACK de ação não recebido para o pivô ${exists?.pivot_id}`
        );
        return;
      }

      await Injector.get(INJECTOR_COMMONS.IOT_CONFIG)?.publisher(
        topic,
        message
      );

      await this.checkMessageReceived(
        { ...action, attempts: action.attempts + 1 },
        topic,
        message
      );
    }, 5000);
  }

  subscribe({ action, topic, message }: SubProps) {
    const { toList } = splitMsgCloud(action);

    console.log("------------------------List------------------------------");
    console.log(toList);

    const exists = this.checkByPivot(toList[1]);

    if (exists) this.exclude(toList[1]);

    const newAction = {
      pivot_id: toList[1],
      author: toList[4] || "manual",
      idp: IDPS.COMANDS,
      attempts: 1,
    };
    console.log("new Action---------------- ", newAction);
    this.#action.push(newAction);
    this.checkMessageReceived(newAction, topic, message);
  }
}
