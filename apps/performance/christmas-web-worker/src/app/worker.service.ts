import { Observable } from 'rxjs';
import {
  HeavyCalculationStart,
  WorkerRequest,
  WorkerResponse,
  receiveWorkerResponses,
  sendWorkerRequest,
} from './worker/worker.model';

export class WorkerService {
  private worker: Worker;
  private handlers = new Map<number, (message: WorkerResponse) => void>();

  constructor() {
    this.worker = new Worker(
      new URL('./worker/worker.worker', import.meta.url),
    );
    receiveWorkerResponses(this.worker, (message) => {
      const handler = this.handlers.get(message.opid);
      if (handler) handler(message);
    });
  }

  /**
   * WARN: Since web worker does not have a cancellation token, unsubscription will NOT abort
   * a runnung computation, so in current UI, if the user presses Discover multiple times, he/she
   * will not see the progress (tied to the latest computation thanks to the `switchMap`
   * in the `AppComponent`) until the worker plows through the queue of requests.
   */
  heavyCalculation(): Observable<WorkerService.HeavyCalculationMessage> {
    return new Observable((subscriber) => {
      const message: WorkerRequest = new HeavyCalculationStart();
      const { opid } = message;
      sendWorkerRequest(this.worker, message);
      this.handlers.set(opid, (message) => {
        if (message.rescode === 'heavyCalculationProgress')
          subscriber.next(
            new WorkerService.HeavyCalculationProgressMessage(
              message.percentage,
            ),
          );
        else if (message.rescode === 'heavyCalculationResult') {
          subscriber.next(new WorkerService.HeavyCalculationResultMessage());
          subscriber.complete();
          this.handlers.delete(opid);
        }
      });
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WorkerService {
  export type HeavyCalculationMessage =
    | HeavyCalculationProgressMessage
    | HeavyCalculationResultMessage;

  export class HeavyCalculationProgressMessage {
    constructor(readonly percentage: number) {}
  }

  export class HeavyCalculationResultMessage {}
}
