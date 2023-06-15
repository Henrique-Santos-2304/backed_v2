class RadioVariableModel {
  radio_variable_id: string;

  pivot_id: string;

  father: string | null;

  rssi: number | null;

  noise: number | null;

  timestamp: Date;
}

export { RadioVariableModel };
