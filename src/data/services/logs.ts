import {
  IWriteLogs,
  WriteLogDateProps,
  WriteLogsMessageType,
} from "@root/domain";
import dayjs from "dayjs";
import fs from "node:fs";
import os from "node:os";

const userHomeDir = os.homedir();

const initialDir = `${userHomeDir}/logs_pivos`;

export class WriteLog implements IWriteLogs {
  private date: WriteLogDateProps = {
    day: 1,
    month: "Janeiro",
    year: 2022,
    hour: 0,
    minute: 0,
    second: 0,
  };

  private dateString: string;

  handleMonth(month: number): void {
    switch (month) {
      case 1:
        this.date.month = "Janeiro";
        break;
      case 2:
        this.date.month = "Fevereiro";
        break;
      case 3:
        this.date.month = "Março";
        break;
      case 4:
        this.date.month = "Abril";
        break;
      case 5:
        this.date.month = "Maio";
        break;
      case 6:
        this.date.month = "Junho";
        break;
      case 7:
        this.date.month = "Julho";
        break;
      case 8:
        this.date.month = "Agosto";
        break;
      case 9:
        this.date.month = "Setembro";
        break;
      case 10:
        this.date.month = "Outubro";
        break;
      case 11:
        this.date.month = "Novembro";
        break;
      case 12:
        this.date.month = "Dezembro";
        break;
      default:
        null;
        break;
    }
  }

  async getDate() {
    const fullDate = dayjs();
    const month = fullDate.add(1, "month").month();
    this.handleMonth(month);
    this.date.day = fullDate.date();
    this.date.hour = fullDate.subtract(3, "hour").hour();
    this.date.minute = fullDate.minute();
    this.date.second = fullDate.second();
    this.date.year = fullDate.year();

    this.dateString = `${this.date.day}/${month}/${this.date.year} ${this.date.hour}:${this.date.minute}:${this.date.second} -> `;
  }

  async mountPath(type: WriteLogsMessageType, pivot: string) {
    this.getDate();
    const fileName = `${type}.txt`;
    const dir = `${initialDir}/${pivot}/${this.date.month}/${this.date.day}`;
    const path = `/${dir}/${fileName}`;
    return { dir, path };
  }

  async checkOrCreateDir(pivot: string) {
    const withFiles = `${initialDir}/${pivot}`;
    const withMonth = `${withFiles}/${this.date.month}`;
    const withDay = `${withMonth}/${this.date.day}`;

    if (!fs.existsSync(initialDir)) fs.mkdirSync(initialDir);
    if (!fs.existsSync(withFiles)) fs.mkdirSync(withFiles);
    if (!fs.existsSync(withMonth)) fs.mkdirSync(withMonth);
    if (!fs.existsSync(withDay)) fs.mkdirSync(withDay);
  }

  async write(type: WriteLogsMessageType, pivot: string, message: string) {
    const isDevelopments = process.env.NODE_ENV === "development";

    if (isDevelopments) return;

    const { path } = await this.mountPath(type, pivot);
    this.checkOrCreateDir(pivot);

    const mountMessage = `\n ${this.dateString} ${message}\n`;
    fs.appendFile(path, mountMessage, (error) => {
      if (error) console.error(error.message);
    });
  }
}
