import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { Observable, of, throwError } from 'rxjs';
import { Locator } from '../../testing';
import { BackendService, Ticket, User } from '../backend.service';
import { ListComponent } from './list.component';
import { RowComponentHarness } from './ui/row.harness';

const USERS = [
  { id: 1, name: 'titi' },
  { id: 2, name: 'george' },
];

const TICKETS: Ticket[] = [
  {
    id: 0,
    description: 'Install a monitor arm',
    assigneeId: 1,
    completed: false,
  },
  {
    id: 1,
    description: 'Coucou',
    assigneeId: 1,
    completed: false,
  },
];

type Public<T> = { [k in keyof T]: T[k] };

class FakeBackendService implements Public<BackendService> {
  get storedTickets(): Ticket[] {
    throw new Error('Property not implemented.');
  }
  get storedUsers(): User[] {
    throw new Error('Property not implemented.');
  }
  get lastId(): number {
    throw new Error('Property not implemented.');
  }
  tickets(): Observable<Ticket[]> {
    return of(TICKETS);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ticket(id: number): Observable<Ticket | undefined> {
    throw new Error('Method not implemented.');
  }
  users(): Observable<User[]> {
    return of(USERS);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user(id: number): Observable<User | undefined> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newTicket(payload: { description: string }): Observable<Ticket> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  assign(
    ticketId: number,
    userId: number,
  ): Observable<{
    assigneeId: number | null;
    description: string;
    completed: boolean;
    id: number;
  }> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  complete(
    ticketId: number,
    completed: boolean,
  ): Observable<{
    assigneeId: number | null;
    description: string;
    completed: boolean;
    id: number;
  }> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(
    ticketId: number,
    updates: Partial<Omit<Ticket, 'id'>>,
  ): Observable<{
    assigneeId: number | null;
    description: string;
    completed: boolean;
    id: number;
  }> {
    throw new Error('Method not implemented.');
  }
}

async function setup({
  backendService,
}: {
  backendService?: Public<BackendService>;
} = {}) {
  await TestBed.configureTestingModule({
    imports: [
      ListComponent,
      ReactiveFormsModule,
      RouterTestingModule,
      NoopAnimationsModule,
    ],
    providers: [
      backendService == null
        ? BackendService
        : {
            provide: BackendService,
            useValue: backendService,
          },
    ],
  }).compileComponents();

  const { fixture } = await render(ListComponent);
  fixture.detectChanges();

  const locator = new Locator(fixture.debugElement);
  return { fixture, locator };
}

describe('ListComponent', () => {
  describe('Given Install inside the search input', () => {
    it('Then one row is visible', async () => {
      const { locator } = await setup({
        backendService: new FakeBackendService(),
      });
      await user.type(
        screen.getByRole('textbox', { name: /Search/i }),
        'Install',
      );
      expect(
        locator.getAllHarnesses(RowComponentHarness.with({})),
      ).toHaveLength(1);
    });
  });

  describe('When typing a description and clicking on add a new ticket', () => {
    describe('Given a success answer from API', () => {
      it('Then ticket with the description is added to the list with unassigned status', async () => {
        const { fixture, locator } = await setup();
        await fixture.whenStable();
        fixture.detectChanges();

        await user.type(
          screen.getByRole('textbox', { name: /Description/i }),
          'Test123',
        );
        await user.click(
          screen.getByRole('button', { name: /Add new ticket/i }),
        );
        await fixture.whenStable();
        fixture.detectChanges();

        const row = locator.getHarness(
          RowComponentHarness.with({ description: 'Test123' }),
        );
        expect(row.assignee).toMatch(/Unassigned/i);
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        class TestBackendService extends FakeBackendService {
          override newTicket = () =>
            throwError(() => new Error('Network error'));
        }

        const { fixture } = await setup({
          backendService: new TestBackendService(),
        });
        await fixture.whenStable();
        fixture.detectChanges();

        await user.type(
          screen.getByRole('textbox', { name: /Description/i }),
          'Test123',
        );
        await user.click(
          screen.getByRole('button', { name: /Add new ticket/i }),
        );
        await fixture.whenStable();
        fixture.detectChanges();

        const errorEl =
          fixture.debugElement.nativeElement.querySelector('.text-red-500');
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toContain(/Network error/i);
      });
    });
  });

  describe('When assigning first ticket to george', () => {
    describe('Given a success answer from API', () => {
      it('Then first ticket is assigned to George', async () => {
        class TestBackendService extends FakeBackendService {
          override assign(ticketId: number, userId: number) {
            const ticket = TICKETS.find((ticket) => ticket.id === ticketId);
            if (!ticket)
              return throwError(
                () => new Error(`No ticket with id ${ticketId}`),
              );
            const updatedTicket = { ...ticket, assigneeId: userId };
            return of(updatedTicket);
          }
        }

        const { fixture, locator } = await setup({
          backendService: new TestBackendService(),
        });

        const rows = locator.getHarness(
          RowComponentHarness.with({ description: 'Install a monitor arm' }),
        );
        expect(rows.length).toBeGreaterThan(0);
        const row = rows[0];

        await row.assignTo('george');

        expect(row.assignee).toMatch(/Unassigned/i);
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        //
      });
    });
  });

  describe('When finishing first ticket', () => {
    describe('Given a success answer from API', () => {
      it('Then first ticket is done', async () => {
        //
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        //
      });
    });
  });

  describe('When clicking on first ticket', () => {
    it('Then we navigate to detail/0', async () => {
      //
    });
  });
});
