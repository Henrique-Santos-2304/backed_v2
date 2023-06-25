import { SchedulingModel } from "@root/infra/models";

export type InitScheduleType = {
  id: string;
  date: number;
  dataBind: any;
  cb: (data: any) => void;
};

export type ScheduleJobIniType = {
  job: SchedulingModel;
  is_stop: boolean;
  end_date_diff?: number | null;
};

export type ObservableAngleType = {
  pivot_id: string;
  requiredAngle: number;
  type?: "desc" | "cresc";
  cb: () => void;
};

export interface IBaseScheduleCase {
  sendJob({ job, is_stop, end_date_diff }: ScheduleJobIniType): void;
}

export interface IScheduler {
  stop(id: string): void;
  start({ id, date, cb }: InitScheduleType): void;
}
