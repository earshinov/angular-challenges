/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { TextComponent } from './text.component';

export type StaticTextType = 'normal' | 'warning' | 'error';

/**
 * Supported CSS classes:
 *
 *   - `warning`
 *   - `error`
 */
@Component({
  selector: 'static-text',
  standalone: true,
  imports: [TextComponent],
  template: `
    <text>This is a static text</text>
  `,
  styles: `
    text {
      --app-text-font: 10px;
      --app-text-color: black;
    }
    :host-context(.warning) text {
      --app-text-font: 25px;
      --app-text-color: orange;
    }
    :host-context(.error) text {
      --app-text-font: 30px;
      --app-text-color: red;
    }
  `,
})
export class TextStaticComponent {}
