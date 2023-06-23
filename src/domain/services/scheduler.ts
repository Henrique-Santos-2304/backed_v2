import { SchedulingModel } from "@root/infra/models";

export type InitScheduleType = {
  id: string;
  date: Date | string;
  dataBind: any;
  cb: (data: any) => void;
};

export type ScheduleJobIniType = {
  job: SchedulingModel;
  is_stop: boolean;
};

export type ObservableAngleType = {
  pivot_id: string;
  requiredAngle: number;
  cb: () => void;
};

export interface IBaseScheduleCase {
  sendJob({ job, is_stop }: ScheduleJobIniType): void;
}

export interface IScheduler {
  stop(id: string): void;
  start({ id, date, cb }: InitScheduleType): void;
}
