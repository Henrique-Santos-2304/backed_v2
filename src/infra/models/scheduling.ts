import { StateModel } from "./state";

class SchedulingModel {
  scheduling_id: string; // scheduling

  pivot_id: string;

  author: string;

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
