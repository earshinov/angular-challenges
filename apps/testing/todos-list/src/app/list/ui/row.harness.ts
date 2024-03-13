import { HarnessLoader as AngularHarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '../../../testing';
import { RowComponent } from './row.component';

export interface RowComponentHarnessFilters extends BaseHarnessFilters {
  ticket?: number;
  description?: string | RegExp | null;
  assignee?: string | RegExp | null;
  done?: boolean;
}

export class RowComponentHarness extends ComponentHarness {
  static with(
    angularHarnessLoader: AngularHarnessLoader,
    filters: RowComponentHarnessFilters = {},
  ) {
    return new HarnessPredicate(
      RowComponent,
      RowComponentHarness,
      angularHarnessLoader,
      filters,
    )
      .addOption(
        'Ticket',
        filters.ticket,
        (harness, value) => harness.ticket === value,
      )
      .addOption('Description', filters.description, (harness, text) =>
        HarnessPredicate.stringMatches(harness.description, text),
      )
      .addOption('Assignee', filters.assignee, (harness, text) =>
        HarnessPredicate.stringMatches(harness.assignee, text),
      )
      .addOption(
        'Done',
        filters.done,
        (harness, value) => harness.done === value,
      );
  }

  get ticket(): number {
    const text = this.findSectionText(/ticket/i);
    const value = Number(text);
    expect(value).not.toBeNaN();
    return value;
  }

  get description(): string {
    return this.findSectionText(/description/i);
  }

  get assignee(): string {
    return this.findSectionText(/assignee/i);
  }

  get done(): boolean {
    const text = this.findSectionText(/ticket/i);
    return Boolean(text);
  }

  async assignTo(userDisplayName: string) {
    new MatSelectHarness(new LocatorFactory());
  }

  private findSection(reSectionTitle: RegExp): Element {
    const el = this.debugElement.nativeElement as Element;
    const childEl: Element | null = Array.prototype.find.call(
      el.querySelectorAll('.font-bold'),
      (childEl: Element) =>
        childEl.textContent != null && reSectionTitle.test(childEl.textContent),
    );
    expect(childEl).not.toBeNull();
    return childEl!;
  }

  private findSectionText(reSectionTitle: RegExp): string {
    const childEl = this.findSection(reSectionTitle);
    const chunks: string[] = [];
    for (
      let textEl: Node | null = childEl.nextSibling;
      textEl;
      textEl = textEl.nextSibling
    )
      if (textEl.textContent != null) chunks.push(textEl.textContent);
    return this.normalizeTextContent(chunks.join(''));
  }

  private normalizeTextContent(s: string): string {
    return s.trim().replace(/\s+/, ' ');
  }
}
