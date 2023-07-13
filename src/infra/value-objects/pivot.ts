import { IAppDate } from "@root/domain";
import { PivotModel } from "../models";
import { CreatePivotDto } from "@db/dto";

export class MutationPivotVO {
  #pivot: PivotModel;

  constructor() {
    this.#pivot = new PivotModel();
  }

  private checkDataEquals(oldData: PivotModel, newData: PivotModel) {
    const gprsEquals = oldData.is_gprs === newData.is_gprs;
    const gatewayEquals = oldData.ip_gateway === newData.ip_gateway;
    const latEquals = oldData.latitude === newData.latitude;
    const numEquals = oldData.longitude === newData.longitude;
    const lngEquals = oldData.num === newData.num;
    const radiusEquals = oldData.radius === newData.radius;
    const startEquals = oldData.start_angle === newData.start_angle;
    const endEquals = oldData.end_angle === newData.end_angle;

    if (
      gprsEquals &&
      gatewayEquals &&
      latEquals &&
      lngEquals &&
      numEquals &&
      radiusEquals &&
      startEquals &&
      endEquals
    ) {
      throw new Error("Dados iguais nada para atualizar");
    }
  }

  create(date: IAppDate, pivot: CreatePivotDto) {
    this.#pivot = { ...this.#pivot, ...pivot };
    this.#pivot.id = `${pivot?.farm_id}_${pivot?.num}`;
    this.#pivot.last_timestamp = new Date();
    this.#pivot.init_angle = 0;
    this.#pivot.last_state = `#0-${
      this.#pivot.id
    }-052-000-000-000-${date.dateSpString()}$`;

    return this;
  }

  update(oldPivot: PivotModel, newPivot: PivotModel) {
    this.checkDataEquals(oldPivot, newPivot);

    this.#pivot = {
      ...oldPivot,
      ...newPivot,
      num:
        oldPivot?.num === newPivot?.num ? oldPivot?.num : Number(newPivot?.num),
      farm_id: oldPivot?.farm_id,
      init_angle: oldPivot?.init_angle,
      last_state: oldPivot?.last_state,
      last_timestamp: oldPivot?.last_timestamp,

      id:
        oldPivot?.num === newPivot?.num
          ? oldPivot?.id
          : `${oldPivot.farm_id}_${newPivot?.num}`,
    };

    return this;
  }

  find = () => this.#pivot;
}
