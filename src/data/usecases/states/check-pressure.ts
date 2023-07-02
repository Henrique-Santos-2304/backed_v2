import { CreateStateDto } from "@root/infra";
import { StateModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { INJECTOR_CASES, INJECTOR_COMMONS } from "@root/shared";

import {
  IAppLog,
  IBaseUseCases,
  ISocketServer,
  PivotPressureType,
  StateReceivedType,
} from "@root/domain";
import { checkPivotExist } from "../pivots/helpers";
import { checkFarmExist } from "../farms/helpers";

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

  private async createStateAndVariable(
    pivot_id: string,
    fail: boolean = true,
    states?: StateReceivedType
  ) {
    const state = await Injector.get<IBaseUseCases<CreateStateDto, StateModel>>(
      INJECTOR_CASES.STATES.CREATE
    ).execute({
      power: fail ? false : states?.power || false,
      direction: fail ? "CLOCKWISE" : states?.direction || "CLOCKWISE",
      water: fail ? false : states?.water || false,
      connection: true,
      pivot_id,
    });

    if (!state) return;

    Injector.get<IBaseUseCases>(INJECTOR_CASES.STATE_VARIABLES.CREATE).execute({
      state_id: state?.state_id,
      percentimeter: fail ? 0 : states?.percentimeter || 0,
      angle: fail ? 0 : states?.angle || 0,
    });
  }

  private async checkAttempts(check: PivotPressureType) {
    if (check.attempts >= 10) {
      this.remove(check?.pivot_id);
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
        `'Erro, nenhuma resposta de pressurização recebido para o pivô '  ${check?.pivot_id}`
      );
      this.createStateAndVariable(check?.pivot_id);
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

  private async emitSocket(pivot_id: string, angle: string) {
    const piv = await checkPivotExist(pivot_id);
    const farm = await checkFarmExist(piv?.farm_id);

    Injector.get<ISocketServer>(INJECTOR_COMMONS.SOCKET).publisher(
      "pressure-changed",
      {
        user_id: farm?.user_id,
        farm_id: farm?.farm_id,
        pivot_id,
        angle: Number(angle) || 0,
        pressure: true,
      }
    );
  }

  async dispatch(toList: string[]) {
    const [idp, pivot_id, state, percent, angle, _] = toList;

    const is_pressure = state[1] === "7";
    const direction = state[0] === "4" ? "ANTI_CLOCKWISE" : "CLOCKWISE";
    const water = state[1] === "6";
    const power = state[2] === "1";

    if (is_pressure) {
      return this.emitSocket(pivot_id, angle);
    }

    this.remove(pivot_id);

    if (water) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).log(
        `Pressurização do pivô ${pivot_id} finalizada com sucesso `
      );
      return this.createStateAndVariable(pivot_id, false, {
        direction,
        water,
        power,
        percentimeter: Number(percent),
        angle: Number(angle),
      });
    }

    if (!power) {
      Injector.get<IAppLog>(INJECTOR_COMMONS.APP_LOGS).error(
        `'Pressurização do pivô ${pivot_id} finalizada pelo usuário '  `
      );
    }

    return await this.createStateAndVariable(pivot_id);
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
