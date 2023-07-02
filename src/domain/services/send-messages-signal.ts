import { StateModel } from "@root/infra/models";

export type SendMessageSignalType = {
  users: string[];
  farm_name: string;
  state: Partial<StateModel>;
};

export type CloudMqttRemotePayloadType = {
  payload: string;
  id: string;
  type: "status" | "action";
  is_gateway?: boolean;
};
