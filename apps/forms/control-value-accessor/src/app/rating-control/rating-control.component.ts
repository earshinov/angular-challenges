import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-rating-control',
  templateUrl: 'rating-control.component.html',
  styleUrls: ['rating-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingControlComponent,
      multi: true,
    },
  ],
})
export class RatingControlComponent implements ControlValueAccessor {
  private onChange: (value: RatingControlComponent.Value) => void = noop;
  private onTouched: () => void = noop;
  disabled = false;

  value: RatingControlComponent.Value = null;

  constructor(private cd: ChangeDetectorRef) {}

  protected setRating(index: number): void {
    this.value = index + 1;
    this.onTouched();
    this.onChange(this.value);
  }

  protected isStarActive(index: number, value: number | null): boolean {
    return value ? index < value : false;
  }

  // #region ControlValueAccessor

  writeValue(value: RatingControlComponent.Value): void {
    this.value = value;
    this.cd.markForCheck();
  }

  registerOnChange(fn: (value: RatingControlComponent.Value) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  // #endregion
}
export namespace RatingControlComponent {
  export type Value = number | null;
}
