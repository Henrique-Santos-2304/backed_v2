import { IBaseUseCases, IWriteLogs, SendMessageSignalType } from "@root/domain";
import { CreateStateDto } from "@root/infra";
import { StateModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { INJECTOR_COMMONS, splitMsgCloud } from "@root/shared";
import https from "https";

export class SendMessagesSignal implements IBaseUseCases {
  async send(users: string[], message: { farm: string; message: string }) {
    try {
      const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
        },
      };

      const req = https.request(options, (res) => {
        res.on("data", (data) => {});
      });

      req.on("error", (e) => {
        console.log("ERROR:");
        console.log(e.message);
      });

      const dataMessage = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        headings: { en: message.farm },
        contents: { en: message.message },
        include_external_user_ids: [...users],
      };

      const data = JSON.stringify(dataMessage);
      req.write(data);

      req.end();
    } catch (err) {
      console.log(err.message);
    }
  }

  async mount_message(farm_id: string, state: CreateStateDto) {
    const pivot_id = state?.pivot_id?.split("_");

    const num = pivot_id ? pivot_id[pivot_id.length - 1] : 0;

    const { toList } = splitMsgCloud(state?.status);
    const power = toList[2][2] === "1" ? "Ligado" : "Desligado";
    const water =
      toList[2][1] === "6"
        ? "Pressurizando"
        : toList[2][1] === "6"
        ? "Irrigando"
        : " Seco";

    const direction = toList[0] === "3" ? "Reverso" : "Avanço";

    const message = {
      farm: `Fazenda ${farm_id?.toUpperCase()}`,
      message:
        toList[2][2] === "1"
          ? `Pivô ${num} ${power} - ${water} - ${direction}`
          : `Pivô ${num} Desligado`,
    };

    /*  await writeLog.write(
        'NOTIFICATION',
        state!.pivot_id,
        JSON.stringify(message)
      ); */

    return message;
  }

  async execute({ users, farm_name, state }: SendMessageSignalType) {
    const message = await this.mount_message(farm_name, state);
    Injector.get<IWriteLogs>(INJECTOR_COMMONS.WRITE_LOGS).write(
      "NOTIFICATION",
      state?.pivot_id!,
      JSON.stringify(state)
    );
    await this.send(users, message);
  }
}
