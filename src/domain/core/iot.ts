export interface IIotConnect {
  start(): void;
  publisher(topic: string, message: string): Promise<void>;
}
