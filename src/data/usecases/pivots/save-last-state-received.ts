import { IAppLog, IBaseRepository, IIotConnect } from "@root/domain";
import { IStateReceivedPivotExecute } from "@root/domain/usecases";
import { PivotModel } from "@root/infra/models";
import { checkPivotExist } from "./helpers/check-pivots";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import { Injector } from "@root/main/injector";

export class SaveLastStatePivotUseCase {
  #baseRepo: IBaseRepository;
  #console: IAppLog;
  #iot: IIotConnect;

  private initInstances() {
    this.#baseRepo = this.#baseRepo ?? Injector.get(INJECTOR_REPOS.BASE);
    this.#iot = this.#iot ?? Injector.get(INJECTOR_COMMONS.IOT_CONFIG);

    this.#console = this.#console ?? Injector.get(INJECTOR_COMMONS.APP_LOGS);
  }

  private splitMessage(payload: string) {
    const arrayMessage = payload.split("-");

    if (arrayMessage.length !== 6)
      throw new Error("Formato de mensagem invalido");

    const pivot_id = arrayMessage[1];
    const message = payload.split(`${pivot_id}-`)[1];

    return { pivot_id, message };
  }

  private async putPivot(pivot_id: string, message: string) {
    await this.#baseRepo.update<Partial<PivotModel>>({
      column: DB_TABLES.PIVOTS,
      where: "pivot_id",
      equals: pivot_id,
      data: {
        last_state: message,
        last_timestamp: new Date(),
        last_angle: Number(message.split("-")[2]),
      },
    });
  }

  execute: IStateReceivedPivotExecute = async ({ payload }) => {
    this.initInstances();

    const { pivot_id, message } = this.splitMessage(payload);

    this.#console.log(`Recebido Status ${message} para pivo  ${pivot_id}`);

    const oldPivot = await checkPivotExist(this.#baseRepo.findOne, pivot_id);

    await this.putPivot(pivot_id, message);

    if (oldPivot?.is_gprs) {
      await this.#iot.publisher(`${oldPivot?.farm_id}_0`, `#${payload}$`);
    }

    this.#console.log("Atualização de Status finalizada com sucesso... \n");
  };
}
