import { FarmModel } from "../models";

export class CreateFarmDto {
  user_id: FarmModel["user_id"];
  farm_id: FarmModel["farm_id"];
  farm_name: FarmModel["farm_name"];
  farm_city: FarmModel["farm_city"];
  farm_lat: FarmModel["farm_lat"];
  dealer?: FarmModel["dealer"];
}
