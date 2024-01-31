import { BtnDisabledDirective } from '@angular-challenges/decoupling/brain';
import { BtnHelmetDirective } from '@angular-challenges/decoupling/helmet';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [BtnDisabledDirective, BtnHelmetDirective],
  selector: 'app-root',
  template: `
    <button
      btnDisabled
      #btnDisabled="btnDisabled"
      [hlm]
      [hlmState]="btnDisabled.state()">
      Coucou
    </button>
  `,
})
export class AppComponent {}
