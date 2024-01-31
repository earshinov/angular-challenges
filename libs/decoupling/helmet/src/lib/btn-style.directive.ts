/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  inject,
} from '@angular/core';

@Directive({
  selector: 'button[hlm]',
  standalone: true,
  host: {
    class:
      'border border-black p-4 rounded-md bg-white data-[state=disabled]:bg-gray-400 data-[state=disabled]:text-white',
  },
})
export class BtnHelmetDirective implements OnChanges {
  @Input('hlm') _hlm: undefined;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('hlmState') state: 'enabled' | 'disabled' = 'disabled';
  private renderer = inject(Renderer2);
  private element = inject(ElementRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (('state' as keyof this) in changes) {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'data-state',
        this.state,
      );
    }
  }
}
