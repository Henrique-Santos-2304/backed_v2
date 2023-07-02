import { PivotModel } from "@root/infra/models";

export type AngleSubscribe = {
  pivot_id: string;
  requiredAngle: number;
  cb: () => void;
};

export type ScheduleStub = {
  pivot_id: string;
  idp: string;
  attempts: number;
  message: string;
  cb: (fail: boolean, msg?: string[]) => void;
};

export interface IObservables<Sub = any> {
  subscribe(params: Sub): void;
  dispatch(...args: any): Promise<string | undefined | void>;
}

export type StatusObservablesType = {
  pivot: PivotModel;
  attempts: number;
  iot: (pivot: PivotModel) => void;
  cbFail: (pivot: PivotModel) => void;
};
