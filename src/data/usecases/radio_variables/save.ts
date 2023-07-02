import { IBaseRepository, IBaseUseCases, IHashId } from "@root/domain";
import { Injector } from "@root/main/injector";

import { checkPivotExist } from "../pivots/helpers";
import { RadioVariableModel } from "@root/infra/models";
import {
  DB_TABLES,
  IDPS,
  INJECTOR_COMMONS,
  INJECTOR_REPOS,
} from "@root/shared";

export class SaveRadioVariableUseCase implements IBaseUseCases {
  #baseRepo: IBaseRepository;
  #hash: IHashId;

  private initInstances() {
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);
    this.#hash = Injector.get(INJECTOR_COMMONS.APP_HASH);
  }

  private handleVariableSave(idp: string, variable: string) {
    if (idp === IDPS.RSSI) return { rssi: Number(variable) };
    else if (idp === IDPS.ROUTE) return { father: variable };
    else if (idp === IDPS.NOISE) return { noise: Number(variable) };
  }

  private splitMessage(message: string) {
    const list = message?.split("-");

    if (list?.length !== 3)
      throw new Error(
        "Formato de mensagem recebida para  Radio Variables inválido"
      );

    const [idp, pivot_id, variable] = list;

    return { idp, pivot_id, variable };
  }

  execute = async (message: string) => {
    this.initInstances();

    const { idp, pivot_id, variable } = this.splitMessage(message);

    await checkPivotExist(pivot_id);

    const value = this.handleVariableSave(idp, variable);

    await this.#baseRepo.create<RadioVariableModel>(DB_TABLES.RADIO_VARIABLES, {
      radio_variable_id: this.#hash.generate(),
      pivot_id,
      timestamp: new Date(),
      rssi: value?.rssi || 0,
      father: value?.father || "",
      noise: value?.noise || 0,
    });
  };
}
