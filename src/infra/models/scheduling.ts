import { StateModel } from "./state";

class SchedulingModel {
  scheduling_id: string;

  pivot_id: string;

  author: string;

  updated?: string;

  start_date_of_module?: string;

  is_board: boolean;
  status: "PENDING" | "RUNNING" | "FINISHED";

  type: "STOP_DATE" | "STOP_ANGLE" | "FULL_DATE" | "FULL_ANGLE";

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

  timestamp: Date | null;
}

export { SchedulingModel };
