export interface IIotConnect {
  start(): void;
  publisher(topic: string, message: any): Promise<void>;
}
