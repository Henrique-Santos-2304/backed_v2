import { IBaseRepository, IBaseUseCases } from "@root/domain";
import { PivotModel } from "@root/infra/models";
import { Injector } from "@root/main/injector";
import { DB_TABLES, INJECTOR_CASES, INJECTOR_REPOS } from "@root/shared";

export class CheckPivotsInterval {
  static CHECK_GPRS_INTERVAL = 10000 * 6 * 20;
  static async check() {
    const repos = Injector.get<IBaseRepository>(INJECTOR_REPOS.BASE);
    const usecase = Injector.get<IBaseUseCases>(
      INJECTOR_CASES.STATES.CHECK_STATUS
    );

    const pivots = await repos.findAllByData<PivotModel>(DB_TABLES.PIVOTS, {
      is_gprs: true,
    });

    pivots.forEach((piv) => usecase.execute(piv?.id));
  }

  static start() {
    /* CheckPivotsInterval.check(); */

    setInterval(() => {
      CheckPivotsInterval.check();
    }, CheckPivotsInterval.CHECK_GPRS_INTERVAL);
  }
}
