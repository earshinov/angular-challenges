import {
  BaseHarnessFilters,
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';

export interface MySliderHarnessFilters extends BaseHarnessFilters {}

export class MySliderHarness extends ComponentHarness {
  static hostSelector = 'app-slider';

  private locMinusButton = this.locatorFor('button[aria-label=Decrease]');
  private locPlusButton = this.locatorFor('button[aria-label=Increase]');
  private locSlider = this.locatorFor(MatSliderHarness);

  static with<T extends MySliderHarness>(
    this: ComponentHarnessConstructor<T>,
    options: MySliderHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options);
  }

  async clickMinus(): Promise<void> {
    await (await this.locMinusButton()).click();
  }

  async clickPlus(): Promise<void> {
    await (await this.locPlusButton()).click();
  }

  async getValue(): Promise<number> {
    return (await (await this.locSlider()).getEndThumb()).getValue();
  }

  async getMinValue(): Promise<number> {
    return (await this.locSlider()).getMinValue();
  }

  async getMaxValue(): Promise<number> {
    return (await this.locSlider()).getMaxValue();
  }

  async disabled(): Promise<boolean> {
    return (await this.locSlider()).isDisabled();
  }

  async setValue(value: number): Promise<void> {
    return (await (await this.locSlider()).getEndThumb()).setValue(value);
  }
}
