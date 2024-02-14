export function sendWorkerRequest(worker: Worker, message: WorkerRequest) {
  worker.postMessage(message);
}

export type WorkerRequest = HeavyCalculationStart;

let opCounter = 1;

export class HeavyCalculationStart {
  readonly opcode = 'heavyCalculation';
  readonly opid: number;

  constructor() {
    this.opid = opCounter++;
  }
}

/* ----------------------------------------------------- */

export function receiveWorkerResponses(
  worker: Worker,
  cb: (message: WorkerResponse) => void,
) {
  worker.onmessage = ({ data }) => {
    cb(data as WorkerResponse);
  };
}

export type WorkerResponse = HeavyCalculationProgress | HeavyCalculationResult;

export class HeavyCalculationProgress {
  readonly rescode = 'heavyCalculationProgress';

  constructor(
    readonly opid: number,
    readonly percentage: number,
  ) {}
}

export class HeavyCalculationResult {
  readonly rescode = 'heavyCalculationResult';

  constructor(readonly opid: number) {}
}
