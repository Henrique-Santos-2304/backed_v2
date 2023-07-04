import { FarmModel } from "../models";
import { CreateFarmDto } from "@db/dto";
import { IGetTimezone } from "@contracts/index";
import { Injector } from "../config";
import { INJECTOR_COMMONS } from "@root/shared";

export class MutationFarmVO {
  #farm: FarmModel;

  constructor() {
    this.#farm = new FarmModel();
  }

  private checkDataEquals(oldData: FarmModel, newData: FarmModel) {
    const idEquals = oldData.id === newData.id;

    const cityEquals = oldData.city === newData.city;
    const latEquals = oldData.latitude === newData.latitude;
    const lngEquals = oldData.longitude === newData.longitude;
    const nameEquals = oldData.name === newData.name;
    const dealerEquals = oldData.dealer === newData.dealer;

    if (
      idEquals &&
      cityEquals &&
      latEquals &&
      lngEquals &&
      nameEquals &&
      dealerEquals
    ) {
      throw new Error("Dados iguais nada para atualizar");
    }
  }

  create(farm: CreateFarmDto) {
    this.#farm = { ...this.#farm, ...farm };
    this.#farm.dealer = farm?.dealer || null;
    this.#farm.timezone = farm?.timezone;
    this.#farm.workers = [];

    return this;
  }

  update(oldFarm: FarmModel, newFarm: FarmModel) {
    this.checkDataEquals(oldFarm, newFarm);

    this.#farm = { ...oldFarm, ...newFarm, workers: oldFarm?.workers };

    return this;
  }

  find = () => this.#farm;
}
