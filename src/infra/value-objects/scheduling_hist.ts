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

  private isTyping(type: SchedulingModel["type"]) {
    const isStop = type === "STOP_ANGLE" || type === "STOP_DATE";

    const isEndDate = type === "STOP_DATE" || type === "FULL_DATE";

    const isEndAngle = type === "FULL_ANGLE" || type === "STOP_ANGLE";

    return { isStop, isEndAngle, isEndDate };
  }

  private mountObject(
    payload: string[],
    author?: string,
    is_board: boolean = true
  ) {
    const type = this.getType(payload[0]);
    const { isStop, isEndDate, isEndAngle } = this.isTyping(type);
    this.#scheduling = {
      scheduling_id: this.#hash.generate(),
      pivot_id: payload[1],
      author: author || "",
      type,
      status: "PENDING",
      is_board: is_board || false,
      is_stop: isStop,
      is_return: type === "FULL_ANGLE",

      power: isStop ? false : payload[5][2] === "1",
      water: isStop ? false : payload[5][1] === "6",
      percentimeter: isStop ? 0 : Number(payload[6]) || 0,
      direction: isStop
        ? "CLOCKWISE"
        : payload[5][0] === "3"
        ? "CLOCKWISE"
        : "ANTI_CLOCKWISE",

      start_angle: null,
      end_angle: !isEndAngle ? null : Number(payload[4]),

      timestamp: this.#date.dateNow(),
      start_timestamp: isStop
        ? null
        : this.#date.addDiffSecond(Number(payload[3])),
      end_timestamp: !isEndDate
        ? null
        : this.#date.addDiffSecond(
            Number(type === "FULL_DATE" ? payload[4] : payload[3])
          ),

      start_date_of_module:
        payload[2] && payload[2] !== "manual"
          ? payload[2]
          : this.#hash.generate(),
    };
  }

  private mountUpdate(
    idp: string,
    newSchedule: SchedulingModel,
    author: string
  ) {
    const hash = this.#hash.generate();
    const type = this.getType(idp);
    const { isStop, isEndDate, isEndAngle } = this.isTyping(type);

    this.#scheduling = {
      scheduling_id: newSchedule?.scheduling_id || hash,
      start_date_of_module: newSchedule?.start_date_of_module || hash,

      pivot_id: newSchedule?.pivot_id,
      author: author,
      updated: newSchedule?.updated || author,

      type,
      status: "PENDING",
      is_board: newSchedule?.is_board || false,
      is_return: type === "FULL_ANGLE",
      is_stop: isStop,

      power: isStop ? false : newSchedule?.power || false,
      water: isStop ? false : newSchedule?.water || false,
      direction: isStop ? "CLOCKWISE" : newSchedule?.direction || "CLOCKWISE",
      percentimeter: isStop ? 0 : newSchedule?.percentimeter || 0,

      start_angle: null,
      end_angle: !isEndAngle ? null : newSchedule?.end_angle,

      end_timestamp: !isEndDate
        ? null
        : !newSchedule?.is_board
        ? this.#date.toDateSP(newSchedule?.end_timestamp!)
        : this.#date.dateNow(),

      start_timestamp: isStop
        ? null
        : !newSchedule?.is_board
        ? this.#date.toDateSP(newSchedule?.start_timestamp!)
        : this.#date.dateNow(),

      timestamp: this.#date.dateNow(),
    };
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
