import { FarmModel } from "../models";
import { CreateFarmDto } from "@db/dto";
import { IHashId } from "@contracts/index";

export class MutationFarmVO {
  #farm: FarmModel;

  constructor() {
    this.#farm = new FarmModel();
  }

  private checkDataEquals(oldData: FarmModel, newData: FarmModel) {
    const idEquals = oldData.farm_id === newData.farm_id;

    const cityEquals = oldData.farm_city === newData.farm_city;
    const latEquals = oldData.farm_lat === newData.farm_lat;
    const lngEquals = oldData.farm_lng === newData.farm_lng;
    const nameEquals = oldData.farm_name === newData.farm_name;
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

  create(uuidGenerator: IHashId, farm: CreateFarmDto) {
    this.#farm.farm_id = uuidGenerator.generate();
    this.#farm = { ...this.#farm, ...farm };
    this.#farm.dealer = farm?.dealer || null;
    this.#farm.users = [];

    return this;
  }

  update(oldFarm: FarmModel, newFarm: FarmModel) {
    this.checkDataEquals(oldFarm, newFarm);

    this.#farm = { ...oldFarm, ...newFarm, users: oldFarm?.users };

    return this;
  }

  find = () => this.#farm;
}
