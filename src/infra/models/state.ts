class StateModel {
  state_id: string;

  pivot_id: string;

  author?: string;

  connection: boolean;

  power: boolean;

  water: boolean;

  start_angle?: number | null;

  direction: "CLOCKWISE" | "ANTI_CLOCKWISE";

  timestamp: Date;
}

export { StateModel };
