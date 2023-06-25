import { Injector } from "@root/main/injector";
import { IBaseUseCases, IObservables } from "@root/domain";
import {
  IDPS,
  INJECTOR_CASES,
  INJECTOR_OBSERVABLES,
  splitMsgCloud,
} from "@root/shared";

export class SchedulingMessages {
  static IDPS_CREATE = [
    IDPS.SCHEDULING_FULL_ANGLE,
    IDPS.SCHEDULING_FULL_DATE,
    IDPS.SCHEDULING_STOP_ANGLE,
    IDPS.SCHEDULING_STOP_DATE,
  ];

  static async start(message: ArrayBuffer) {
    const { toList, idp } = splitMsgCloud(message.toString());
    const is_ack_message = toList.length === 3;

    if (is_ack_message) {
      const initObservable = Injector.get<IObservables>(
        INJECTOR_OBSERVABLES.SCHEDULE
      );

      return initObservable.dispatch(toList);
    }

    if (SchedulingMessages.IDPS_CREATE.includes(idp)) {
      const saveSchedule = Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.SAVE
      );
      return saveSchedule.execute({
        schedule: toList,
        is_board: true,
      });
    }

    if (idp === IDPS.DEL_SCHEDULE) {
      /* Delete Schedule Use Case */
    }
  }
}
