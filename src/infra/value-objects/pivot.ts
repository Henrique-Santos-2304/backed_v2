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
    const latEquals = oldData.pivot_lat === newData.pivot_lat;
    const numEquals = oldData.pivot_num === newData.pivot_num;
    const lngEquals = oldData.pivot_lng === newData.pivot_lng;
    const radiusEquals = oldData.pivot_radius === newData.pivot_radius;
    const startEquals = oldData.pivot_start_angle === newData.pivot_start_angle;
    const endEquals = oldData.pivot_end_angle === newData.pivot_end_angle;

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

  create(pivot: CreatePivotDto) {
    this.#pivot = { ...this.#pivot, ...pivot };
    this.#pivot.pivot_id = `${pivot?.farm_id}_${pivot?.pivot_num}`;
    this.#pivot.radio_id = pivot?.pivot_num;
    this.#pivot.last_timestamp = new Date();
    this.#pivot.last_angle = 0;
    this.#pivot.last_state = `052-000-000-${this.#pivot.last_timestamp.valueOf()}`;

    return this;
  }

  update(oldPivot: PivotModel, newPivot: PivotModel) {
    this.checkDataEquals(oldPivot, newPivot);

    this.#pivot = {
      ...oldPivot,
      ...newPivot,
      pivot_num:
        oldPivot?.pivot_num === newPivot?.pivot_num
          ? oldPivot?.pivot_num
          : Number(newPivot?.pivot_num),
      farm_id: oldPivot?.farm_id,
      last_angle: oldPivot?.last_angle,
      last_state: oldPivot?.last_state,
      last_timestamp: oldPivot?.last_timestamp,

      pivot_id:
        oldPivot?.pivot_num === newPivot?.pivot_num
          ? oldPivot?.pivot_id
          : `${oldPivot.farm_id}_${newPivot?.pivot_num}`,
      radio_id:
        oldPivot?.pivot_num === newPivot?.pivot_num
          ? oldPivot?.radio_id
          : Number(newPivot?.pivot_num),
    };

    return this;
  }

  find = () => this.#pivot;
}
