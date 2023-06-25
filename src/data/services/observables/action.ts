import { IAppLog, IObservables } from "@root/domain";
import { ActionProps } from "@root/domain/usecases";
import { Injector } from "@root/main/injector";
import { IDPS, INJECTOR_COMMONS } from "@root/shared";

type Props = {
  timer?: NodeJS.Timeout;
  pivot_id: string;
  idp: string;
  attempts: number;
  author: string;
};

type SubProps = {
  action: ActionProps;
  topic: string;
  message: string;
};

export class CreateActionObservable implements IObservables {
  #action: Props[] = [];

  async dispatch(pivot_id: string) {
    const find = this.checkByPivot(pivot_id);
    this.#action = this.#action.filter((ac) => ac.pivot_id !== pivot_id);
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
    const exists = this.checkByPivot(action?.pivot_id);

    if (exists) this.exclude(action?.pivot_id);

    const newAction = {
      pivot_id: action?.pivot_id,
      author: action?.author,
      idp: IDPS.COMANDS,
      attempts: 1,
    };

    this.#action.push(newAction);
    this.checkMessageReceived(newAction, topic, message);
  }
}
