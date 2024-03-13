import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture } from '@angular/core/testing';

export class HarnessEnvironment extends TestbedHarnessEnvironment {
  // Make public
  constructor(
    nativeElement: Element,
    private fixture: ComponentFixture<unknown>,
  ) {
    super(nativeElement, fixture);
  }

  // Make public
  override createEnvironment(element: Element): HarnessEnvironment {
    return new HarnessEnvironment(element, this.fixture);
  }

  // Make public
  override createComponentHarness<T extends ComponentHarness>(
    harnessType: ComponentHarnessConstructor<T>,
    element: Element,
  ): T {
    return super.createComponentHarness(harnessType, element);
  }
}
