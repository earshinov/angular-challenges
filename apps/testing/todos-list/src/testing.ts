import { HarnessLoader as AngularHarnessLoader } from '@angular/cdk/testing';
import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

export interface ComponentHarnessConstructor<T extends ComponentHarness> {
  new (
    debugElement: DebugElement,
    angularHarnessLoader: AngularHarnessLoader,
  ): T;
}

export class ComponentHarness {
  constructor(
    protected readonly debugElement: DebugElement,
    protected readonly angularHarnessLoader: AngularHarnessLoader,
  ) {
    expect(debugElement).not.toBeNull();
  }
}

ComponentHarness satisfies ComponentHarnessConstructor<ComponentHarness>;

export interface BaseHarnessFilters {}

export class HarnessPredicate<THarness extends ComponentHarness> {
  static stringMatches(s: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') return s === pattern;
    else return !!pattern.exec(s);
  }

  private conditions: ((harness: THarness) => boolean)[] = [];

  constructor(
    readonly componentClass: Type<unknown>,
    readonly harnessFactory: ComponentHarnessConstructor<THarness>,
    readonly angularHarnessLoader: AngularHarnessLoader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filters: BaseHarnessFilters = {},
  ) {}

  addOption<T>(
    _description: string,
    value: T | null | undefined,
    filter: (harness: THarness, value: NonNullable<T>) => boolean,
  ): HarnessPredicate<THarness> {
    if (value == null) return this;
    const other = new HarnessPredicate<THarness>(
      this.componentClass,
      this.harnessFactory,
      this.angularHarnessLoader,
      {},
    );
    other.conditions = [
      ...this.conditions,
      (harness) => filter(harness, value),
    ];
    return other;
  }

  test(debugElement: DebugElement): boolean {
    const harness = new this.harnessFactory(
      debugElement,
      this.angularHarnessLoader,
    );
    return !this.conditions.some((cond) => !cond(harness));
  }
}

export class Locator {
  constructor(private debugElement: DebugElement) {}

  getAllHarnesses<THarness extends ComponentHarness>(
    predicate: HarnessPredicate<THarness>,
  ): THarness[] {
    const debugElements = this.lookup(predicate);
    return debugElements.map(
      (debugEl) =>
        new predicate.harnessFactory(debugEl, predicate.angularHarnessLoader),
    );
  }

  getHarness<THarness extends ComponentHarness>(
    predicate: HarnessPredicate<THarness>,
  ): THarness {
    const debugElements = this.lookup(predicate);
    expect(debugElements).toHaveLength(1);
    return new predicate.harnessFactory(
      debugElements[0] as DebugElement,
      predicate.angularHarnessLoader,
    );
  }

  private lookup<THarness extends ComponentHarness>(
    predicate: HarnessPredicate<THarness>,
  ): readonly DebugElement[] {
    const directiveTest = By.directive(predicate.componentClass);
    const debugElements = this.debugElement.queryAllNodes(
      (debugEl) =>
        directiveTest(debugEl) && predicate.test(debugEl as DebugElement),
    );
    return debugElements as unknown[] as readonly DebugElement[];
  }
}
