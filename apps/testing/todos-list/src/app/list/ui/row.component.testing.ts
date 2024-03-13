import { DebugElement, Predicate } from '@angular/core';
import { MatSelectHarness } from '@angular/material/select/testing';
import { By } from '@angular/platform-browser';
import { within } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { HarnessEnvironment } from '../../../../test/harness-environment';
import { RowComponent } from './row.component';

export class RowComponentTesting {
  static hostSelector: 'app-row';

  static by({
    text,
  }: RowComponentTesting.Filters = {}): Predicate<DebugElement> {
    let pred: Predicate<DebugElement> = By.directive(RowComponent);
    if (text != null) {
      const textFilter = filterText(text);
      pred = (
        (pred) => (debugEl) =>
          pred(debugEl) && textFilter(debugEl.nativeElement.textContent)
      )(pred);
    }
    return pred;
  }

  constructor(
    private harnessEnv: HarnessEnvironment,
    readonly debugEl: DebugElement,
  ) {
    expect(debugEl).not.toBeNil();
  }

  async assignTo(username: TextFilter) {
    const select = within(this.debugEl.nativeElement).getByRole('combobox', {
      name: 'Assign to',
    });
    expect(select).not.toBeNil();

    const selectHarness = this.harnessEnv.createComponentHarness(
      MatSelectHarness,
      select,
    );
    await selectHarness.clickOptions({
      text: username,
    });

    await user.click(
      within(this.debugEl.nativeElement).getByRole('button', {
        name: 'Assign',
      }),
    );
    await this.harnessEnv.forceStabilize();
  }

  async markDone() {
    await user.click(
      within(this.debugEl.nativeElement).getByRole('button', { name: 'Done' }),
    );
    await this.harnessEnv.forceStabilize();
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RowComponentTesting {
  export interface Filters {
    text?: TextFilter | null;
  }
}

type TextFilter = string | RegExp;

function filterText(filter: TextFilter): (s: string) => boolean {
  if (typeof filter === 'string') return (s) => s === filter;
  else return (s) => filter.test(s);
}
