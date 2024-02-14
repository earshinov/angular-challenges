/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

/**
 * Supported CSS variables:
 *
 *   - `--app-text-font`: font size
 *   - `--app-text-color`: text color
 */
@Component({
  selector: 'text',
  standalone: true,
  template: `
    <p>
      <ng-content></ng-content>
    </p>
  `,
  styles: `
    p {
      font-size: var(--app-text-font);
      color: var(--app-text-color);
    }
  `,
})
export class TextComponent {}
