import { AppDate, AppLogs } from "@shared/index";

export const appDate = new AppDate();
export const console = new AppLogs(appDate);
