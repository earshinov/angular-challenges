import { Observable } from 'rxjs';

export class HeavyCalculationService {
  private finalLength = 664579;

  startLoading() {
    return this.randomHeavyCalculationFunction();
  }

  private randomHeavyCalculationFunction(): Observable<number> {
    return new Observable((subscriber) => {
      let loadingLength = 0;
      for (let num = 2; num <= 10000000; num++) {
        let randomFlag = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            randomFlag = false;
            break;
          }
        }
        if (randomFlag) {
          loadingLength++;
          subscriber.next(this.loadingPercentage(loadingLength));
        }
      }
      subscriber.complete();
    });
  }

  private loadingPercentage(loadingLength: number): number {
    return (loadingLength * 100) / this.finalLength;
  }
}
