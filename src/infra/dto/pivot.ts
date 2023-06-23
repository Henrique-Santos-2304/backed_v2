import { FarmModel, PivotModel } from "../models";

export class CreatePivotDto {
  farm_id: FarmModel["farm_id"];
  pivot_num: PivotModel["pivot_num"];
  pivot_lat: PivotModel["pivot_lat"];
  pivot_lng: PivotModel["pivot_lng"];
  pivot_radius: PivotModel["pivot_radius"];
  pivot_start_angle: PivotModel["pivot_start_angle"];
  pivot_end_angle: PivotModel["pivot_end_angle"];
  is_gprs: PivotModel["is_gprs"];
  ip_gateway: PivotModel["ip_gateway"];
}
