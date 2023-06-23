import { Injector } from "@root/main/injector";
import { IAppDate, IHashId } from "@root/domain";
import { IDPS, INJECTOR_COMMONS } from "@root/shared";
import { SchedulingModel } from "../models";

export class MutationScheduleHistVO {
  #scheduling: SchedulingModel;
  #hash: IHashId;
  #date: IAppDate;

  constructor() {
    this.#scheduling = new SchedulingModel();
    this.#hash = Injector.get(INJECTOR_COMMONS.APP_HASH);
    this.#date = Injector.get(INJECTOR_COMMONS.APP_DATE);
  }

  private checkDataEquals(oldData: SchedulingModel, newData: SchedulingModel) {
    const powerEquals = oldData.power === newData.power;
    const directionEquals = oldData.direction === newData.direction;
    const waterEquals = oldData.water === newData.water;
    const percentimeterEquals = oldData.percentimeter === newData.percentimeter;
    const start_timestampEquals =
      oldData.start_timestamp === newData.start_timestamp;
    const end_timestampEquals = oldData.end_timestamp === newData.end_timestamp;
    const start_angleEquals = oldData.start_angle === newData.start_angle;
    const end_angleEquals = oldData.end_angle === newData.end_angle;
    const is_stopEquals = oldData.is_stop === newData.is_stop;
    const is_returnEquals = oldData.is_return === newData.is_return;

    if (
      powerEquals &&
      directionEquals &&
      waterEquals &&
      start_timestampEquals &&
      percentimeterEquals &&
      end_timestampEquals &&
      start_angleEquals &&
      end_angleEquals &&
      is_stopEquals &&
      is_returnEquals
    ) {
      throw new Error("Dados iguais nada para atualizar");
    }
  }

  private getType(idp: string): SchedulingModel["type"] {
    if (idp === IDPS.SCHEDULING_FULL_ANGLE) return "FULL_ANGLE";
    else if (idp === IDPS.SCHEDULING_STOP_ANGLE) return "STOP_ANGLE";
    else if (idp === IDPS.SCHEDULING_STOP_DATE) return "STOP_DATE";
    else return "FULL_DATE";
  }

  private isTyping() {
    const isStop =
      this.#scheduling.type === "STOP_ANGLE" ||
      this.#scheduling.type === "STOP_DATE";

    const isEndDate =
      this.#scheduling.type === "STOP_DATE" ||
      this.#scheduling.type === "FULL_DATE";

    const isEndAngle =
      this.#scheduling.type === "FULL_ANGLE" ||
      this.#scheduling.type === "STOP_ANGLE";

    return { isStop, isEndAngle, isEndDate };
  }

  private mountObject(
    payload: string[],
    author?: string,
    is_board: boolean = true
  ) {
    this.#scheduling.scheduling_id = this.#hash.generate();
    this.#scheduling.pivot_id = payload[1];
    this.#scheduling.is_board = is_board || false;
    this.#scheduling.type = this.getType(payload[0]);
    this.#scheduling.status = "PENDING";
    this.#scheduling.start_date_of_module =
      payload[2] && payload[2] !== "manual"
        ? payload[2]
        : this.#hash.generate();

    const { isStop, isEndDate, isEndAngle } = this.isTyping();
    this.#scheduling.power = isStop ? false : payload[5][2] === "1";
    this.#scheduling.water = isStop ? false : payload[5][1] === "6";

    this.#scheduling.percentimeter = isStop ? 0 : Number(payload[6]) || 0;
    this.#scheduling.is_return = this.#scheduling.type === "FULL_ANGLE";
    this.#scheduling.author = author || "";
    this.#scheduling.end_angle = !isEndAngle ? null : Number(payload[4]);
    this.#scheduling.timestamp = this.#date.dateNow();

    this.#scheduling.direction = isStop
      ? "CLOCKWISE"
      : payload[5][0] === "3"
      ? "CLOCKWISE"
      : "ANTI_CLOCKWISE";

    this.#scheduling.end_timestamp = !isEndDate
      ? null
      : !is_board
      ? this.#date.toDateSP(payload[3])
      : this.#date.dateNow();

    this.#scheduling.start_timestamp = isStop
      ? null
      : !is_board
      ? this.#date.toDateSP(payload[4])
      : this.#date.dateNow();
  }

  private mountUpdate(
    idp: string,
    newSchedule: SchedulingModel,
    author: string
  ) {
    this.#scheduling.start_date_of_module =
      newSchedule?.start_date_of_module || this.#hash.generate();
    this.#scheduling.scheduling_id =
      newSchedule?.scheduling_id || this.#hash.generate();

    const { isStop, isEndDate, isEndAngle } = this.isTyping();

    this.#scheduling.is_board = newSchedule?.is_board || false;
    this.#scheduling.type = this.getType(idp);

    this.#scheduling.power = isStop ? false : newSchedule?.power || false;
    this.#scheduling.water = isStop ? false : newSchedule?.water || false;

    this.#scheduling.is_return = this.#scheduling.type === "FULL_ANGLE";
    this.#scheduling.author = author;
    this.#scheduling.end_angle = !isEndAngle ? null : newSchedule?.end_angle;
    this.#scheduling.updated = newSchedule?.author;

    this.#scheduling.end_timestamp = !isEndDate
      ? null
      : !this.#scheduling.is_board
      ? this.#date.toDateSP(newSchedule?.end_timestamp!)
      : this.#date.dateNow();

    this.#scheduling.start_timestamp = isStop
      ? null
      : !this.#scheduling.is_board
      ? this.#date.toDateSP(newSchedule?.start_timestamp!)
      : this.#date.dateNow();

    this.#scheduling.timestamp = this.#date.dateNow();

    this.#scheduling.direction = isStop
      ? "CLOCKWISE"
      : newSchedule?.direction || "CLOCKWISE";

    this.#scheduling.percentimeter = isStop
      ? 0
      : newSchedule?.percentimeter || 0;
  }

  create(payload: string[], author?: string, is_board?: boolean) {
    this.mountObject(payload, author, is_board);
    return this;
  }

  update(
    idp: string,
    oldSchedule: SchedulingModel,
    newSchedule: SchedulingModel
  ) {
    this.checkDataEquals(oldSchedule, newSchedule);
    this.mountUpdate(idp, newSchedule, oldSchedule?.author);
    return this;
  }

  find = () => this.#scheduling;
}
