export type GetDetailData = {
  date: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
};
export interface IAppDate {
  dateSpString(): string;
  toDateSP(date: Date | string): Date;
  detailsData(date: Date | string): GetDetailData;
  dateNow(): Date;
  toDateSpString(date: Date): string;
  handleDateToHistories(date: string, hour: number): Date;
  catchDiff(date: Date | null): number;
  dateIsAter(dateOne?: Date, dateTwo?: Date): boolean;
  addDiffSecond(second: number): Date;
}
