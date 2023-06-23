export interface IHandlerMessageIot {
  handler(
    topic: string,
    message: ArrayBuffer
  ): Promise<{ topic: string; message: any } | null>;
}
