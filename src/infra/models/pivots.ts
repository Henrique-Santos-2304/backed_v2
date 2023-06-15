import { FarmModel } from "./farms";

export class PivotModel {
  pivot_id: string;
  farm_id: FarmModel["farm_id"];

  pivot_num: number;

  pivot_lng: number;

  pivot_lat: number;

  pivot_start_angle: number;

  pivot_end_angle: number;

  pivot_radius: number;

  radio_id: number;

  is_gprs: boolean;
  ip_gateway?: string;
  last_state: string;
  last_angle: number;
  last_timestamp: Date;
}
