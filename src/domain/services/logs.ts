export type WriteLogsMessageType =
  | "ACTION"
  | "MESSAGE"
  | "NOTIFICATION"
  | "LOST_CONNECTION"
  | "REQUEST"
  | "REQUEST_ERROR";

export type WriteLogDateProps = {
  day: number;
  month: string;
  year: number;
  hour: number;
  minute: number;
  second: number;
};
export interface IWriteLogs {
  write(type: WriteLogsMessageType, pivot: string, message: string): void;
}
