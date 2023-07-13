import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS } from "@root/shared";

import { IAppLog, PivotPressureType } from "@root/domain";

export class CheckPressure {
  #pivotsPressure: PivotPressureType[] = [];

  check(pivot_id: string) {
    return this.#pivotsPressure.find((p) => p?.pivot_id === pivot_id);
  }

  private add(pivot_id: string, timer: NodeJS.Timer) {
    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).warn(
      `Iniciando pressurização do pivô ${pivot_id}`
    );

    this.#pivotsPressure.push({
      pivot_id,
      attempts: 1,
      timer,
      received_message: false,
    });
  }

  private remove(pivot_id: string) {
    clearInterval(this.check(pivot_id)?.timer);
    this.#pivotsPressure = this.#pivotsPressure.filter(
      (p) => p?.pivot_id !== pivot_id
    );
  }

  private async checkAttempts(check: PivotPressureType) {
    if (check.attempts >= 10) {
      this.remove(check?.pivot_id);
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
        `'Erro, nenhuma resposta de pressurização recebido para o pivô '  ${check?.pivot_id}`
      );
      /* this.createStateAndVariable(check?.pivot_id); */
      return;
    }

    Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).log(
      `${check.attempts} ->> Pressurizando pivô ${check?.pivot_id}`
    );

    this.#pivotsPressure = [
      ...this.#pivotsPressure.filter((p) => p.pivot_id !== check?.pivot_id),
      {
        ...check,
        attempts: check?.attempts + 1,
      },
    ];
  }

  async dispatch(toList: string[]) {
    const [_, pivot_id, state, ...__] = toList;

    const water = state[1] === "6";
    const power = state[2] === "1";

    this.remove(pivot_id);

    if (water) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).log(
        `Pressurização do pivô ${pivot_id} finalizada com sucesso `
      );
    }

    if (!power) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
        `'Pressurização do pivô ${pivot_id} finalizada pelo usuário '  `
      );
    }

    return;
  }

  async execute(states: string[]) {
    const timer: NodeJS.Timer = setInterval(async () => {
      if (states?.length !== 6) return;

      const pivot_id = states[1];

      const exists = this.check(pivot_id);

      if (!exists) return this.add(pivot_id, timer);

      this.checkAttempts(exists);
    }, 5000);
  }
}
