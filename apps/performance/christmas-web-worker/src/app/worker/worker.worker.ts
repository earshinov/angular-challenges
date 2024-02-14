/// <reference lib="webworker" />

import { HeavyCalculationService } from './heavy-calculation.service';
import {
  HeavyCalculationProgress,
  HeavyCalculationResult,
  HeavyCalculationStart,
  WorkerRequest,
} from './worker.model';

addEventListener('message', ({ data }) => {
  const message = data as WorkerRequest;
  if (message.opcode === 'heavyCalculation') handleHeavyCalculation(message);
});

function handleHeavyCalculation(message: HeavyCalculationStart) {
  const service = new HeavyCalculationService();
  const subscription = service.startLoading().subscribe((percentage) => {
    postMessage(new HeavyCalculationProgress(message.opid, percentage));
    if (percentage >= 100) {
      postMessage(new HeavyCalculationResult(message.opid));
      subscription.unsubscribe();
    }
  });
}
