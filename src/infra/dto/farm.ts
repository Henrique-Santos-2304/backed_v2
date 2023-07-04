import { FarmModel } from "../models";

export class CreateFarmDto {
  owner: FarmModel["owner"];
  id: FarmModel["id"];
  name: FarmModel["name"];
  dealer?: FarmModel["dealer"];
  latitude: FarmModel["latitude"];
  longitude: FarmModel["longitude"];
  city: FarmModel["city"];
  timezone: FarmModel["timezone"];
}
