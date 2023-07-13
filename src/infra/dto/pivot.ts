import { FarmModel, PivotModel } from "../models";

export class CreatePivotDto {
  farm_id: FarmModel["id"];
  num: PivotModel["num"];
  latitude: PivotModel["latitude"];
  longitude: PivotModel["longitude"];
  radius: PivotModel["radius"];
  start_angle: PivotModel["start_angle"];
  end_angle: PivotModel["end_angle"];
  is_gprs: PivotModel["is_gprs"];
  ip_gateway?: PivotModel["ip_gateway"];
}
