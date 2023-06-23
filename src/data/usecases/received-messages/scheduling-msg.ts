import { IDPS, INJECTOR_CASES, INJECTOR_OBSERVABLES } from "@root/shared";
import { catchDataMessage } from "./helpers/get-data-msg";
import { Injector } from "@root/main/injector";
import { IBaseUseCases, IObservables } from "@root/domain";

export class SchedulingMessages {
  static IDPS_CREATE = [
    IDPS.SCHEDULING_FULL_ANGLE,
    IDPS.SCHEDULING_FULL_DATE,
    IDPS.SCHEDULING_STOP_ANGLE,
    IDPS.SCHEDULING_STOP_DATE,
  ];

  static async start(message: ArrayBuffer) {
    const { payload, idp } = catchDataMessage(message);

    const arrayMessage = payload.split("-");
    const is_ack_message = arrayMessage.length === 3;

    if (is_ack_message) {
      const initObservable = Injector.get<IObservables>(
        INJECTOR_OBSERVABLES.SCHEDULE
      );

      return initObservable.dispatch(payload);
    }

    if (SchedulingMessages.IDPS_CREATE.includes(idp)) {
      const saveSchedule = Injector.get<IBaseUseCases>(
        INJECTOR_CASES.SCHEDULE.SAVE
      );
      return saveSchedule.execute({
        schedule: payload,
        is_board: true,
      });
    }

    if (idp === IDPS.DEL_SCHEDULE) {
      /* Delete Schedule Use Case */
    }
  }
}
