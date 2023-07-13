import { FarmModel } from "./farms";

export class PivotModel {
  id: string;

  farm_id: FarmModel["id"];

  num: number;

  latitude: number;

  longitude: number;

  start_angle: number;

  end_angle: number;

  radius: number;

  is_gprs: boolean;

  ip_gateway?: string;

  last_state: string;

  init_angle: number;

  last_timestamp: Date;
}
