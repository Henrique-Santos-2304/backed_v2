export interface IAppLog {
  log(message: any): void;
  error(message: any): void;
  warn(message: any): void;
}
