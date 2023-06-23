import { SchedulingModel, StateModel } from "../models";

export class CreateScheduleHistDto {
  pivot_id: string;

  author: string;

  idp: string;

  is_board: SchedulingModel["is_board"];

  is_stop?: boolean;

  is_return?: boolean;

  power: boolean | null;

  water: boolean;

  direction: StateModel["direction"];

  percentimeter: number | null;

  start_timestamp: Date | null;

  end_timestamp?: Date | null;

  start_angle?: number | null;

  end_angle?: number | null;

  start_date_of_module?: string;
}
