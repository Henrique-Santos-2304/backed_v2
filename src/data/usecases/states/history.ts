import { IAppDate, IBaseRepository, IBaseUseCases } from "@root/domain";
import { IStateRepo, IStateVariableRepo } from "@root/domain/repos";

import { StateModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_COMMONS, INJECTOR_REPOS } from "@root/shared";
import {
  IGetStateHistoryExec,
  PartialCycleResponse,
} from "@root/domain/usecases";
import { prisma } from "@root/core";
import { State } from "@prisma/client";

const initialCycle = {
  states: [],
  percentimeters: [],
  angles: [],
} as unknown as PartialCycleResponse;

export class GetHistoryStateOfPivot implements IBaseUseCases {
  #appDate: IAppDate;
  #baseRepo: IBaseRepository;

  #variableRepo: IStateVariableRepo;

  #response: PartialCycleResponse[] = [];
  #currentCycle: PartialCycleResponse = initialCycle;
  #stateIsRunning: boolean = false;

  private initInstances() {
    this.#appDate = Injector.get(INJECTOR_COMMONS.APP_DATE);
    this.#baseRepo = Injector.get(INJECTOR_REPOS.BASE);

    this.#variableRepo = Injector.get(INJECTOR_REPOS.STATE_VARIABLES);
  }

  private initCycleState(state: StateModel) {
    this.#stateIsRunning = true;
    this.#currentCycle = {
      ...this.#currentCycle,
      start_date: this.#appDate.toDateSpString(state.timestamp),
      is_running: true,
      start_state: {
        power: state.power || false,
        water: state.water || false,
        start_angle: state.start_angle || 0,
        direction: state.direction || "CLOCKWISE",
      },
      states: [
        ...this.#currentCycle?.states,
        {
          power: state.power || false,
          water: state.water || false,
          direction: state.direction || "CLOCKWISE",
          start_angle: state.start_angle || 0,
          timestamp: this.#appDate.toDateSpString(state.timestamp),
          connection: state.connection || false,
          author: state?.author,
        },
      ],
    };
  }

  private continueActualState(state: StateModel) {
    this.#currentCycle = {
      ...this.#currentCycle,
      is_running: state?.power,
      end_date: !state?.power
        ? this.#appDate.toDateSpString(state?.timestamp)
        : "",
      states: [
        ...this.#currentCycle?.states,
        {
          power: state.power || false,
          water: state.water || false,
          direction: state.direction || "CLOCKWISE",
          start_angle: state.start_angle || 0,
          timestamp: this.#appDate.toDateSpString(state.timestamp),
          connection: state.connection || false,
          author: state?.author,
        },
      ],
    };

    if (!state.power) {
      this.#stateIsRunning = false;
      this.#response.push(this.#currentCycle);
      this.#currentCycle = initialCycle;
    }
  }

  private async mountState(state: StateModel) {
    if (!this.#stateIsRunning && !state?.power) return;

    if (!this.#stateIsRunning && state?.power) {
      return this.initCycleState(state);
    }

    return this.continueActualState(state);
  }

  private async mountVariable(state_id: string) {
    const variables = await this.#variableRepo?.getVariableGroupBy(state_id);

    if (variables?.length <= 0) return;

    for (const variable of variables) {
      this.#currentCycle = {
        ...this.#currentCycle,
        percentimeters: [
          ...this.#currentCycle.percentimeters,
          {
            value: variable.percentimeter! || 0,
            timestamp: this.#appDate.toDateSpString(variable.timestamp!),
            state_id,
          },
        ],
        angles: [
          ...this.#currentCycle.angles,
          {
            value: variable.angle! || 0,
            timestamp: this.#appDate.toDateSpString(variable.timestamp!),
            state_id,
          },
        ],
      };
    }
  }

  execute: IGetStateHistoryExec = async ({
    pivot_id,
    start_date,
    end_date,
  }) => {
    this.initInstances();

    const startDate = this.#appDate.handleDateToHistories(start_date, 0);
    const endDate = this.#appDate.handleDateToHistories(end_date, 24);

    const states = (await this.#baseRepo.findAllByData(DB_TABLES.STATES, {
      pivot_id,
      connection: true,
      timestamp: { gte: startDate, lt: endDate },
    })) as unknown as StateModel[];

    if (!states || states.length <= 0) {
      console.warn("Não exitem alterações de estado nesse periodo.\n");
      return [] as PartialCycleResponse[];
    }

    for (let state of states) {
      await this.mountState(state);

      await this.mountVariable(state?.state_id);
    }

    if (this.#stateIsRunning) this.#response.push(this.#currentCycle);

    return this.#response.reverse();
  };
}
