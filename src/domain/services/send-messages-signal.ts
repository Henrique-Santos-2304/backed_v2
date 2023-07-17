import { CreateStateDto } from "@root/infra";
import { StateModel } from "@root/infra/models";

export type SendMessageSignalType = {
  users: string[];
  farm_name: string;
  state: CreateStateDto;
};

export type CloudMqttRemotePayloadType = {
  payload: string;
  id: string;
  type: "status" | "action";
  is_gateway?: boolean;
};
