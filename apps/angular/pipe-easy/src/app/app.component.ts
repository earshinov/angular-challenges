import { NgFor } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heavyComputation',
  standalone: true,
})
export class HeavyComputationPipe implements PipeTransform {
  transform(name: string, index: number) {
    // very heavy computation
    return `${name} - ${index}`;
  }
}

@Component({
  standalone: true,
  imports: [NgFor, HeavyComputationPipe],
  selector: 'app-root',
  template: `
    <div *ngFor="let person of persons; let index = index">
      {{ person | heavyComputation: index }}
    </div>
  `,
})
export class AppComponent {
  persons = ['toto', 'jack'];
}
