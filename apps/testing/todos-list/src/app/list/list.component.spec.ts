import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { render, screen, within } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { Observable, of, throwError } from 'rxjs';
import { TICKETS, USERS } from '../../../test/data';
import { HarnessEnvironment } from '../../../test/harness-environment';
import { BackendService, Ticket, User } from '../backend.service';
import { ListComponent } from './list.component';
import { RowComponentTesting } from './ui/row.component.testing';

class FakeBackendService implements Partial<BackendService> {
  tickets(): Observable<Ticket[]> {
    return of(TICKETS);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  users(): Observable<User[]> {
    return of(USERS);
  }
}

async function setup({
  backendService,
}: {
  backendService?: Partial<BackendService>;
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

  const harnessEnv = new HarnessEnvironment(
    fixture.debugElement.nativeElement,
    fixture,
  );
  return { fixture, harnessEnv };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('ListComponent', () => {
  describe('Given Install inside the search input', () => {
    it('Then one row is visible', async () => {
      const { fixture } = await setup({
        backendService: new FakeBackendService(),
      });
      await user.type(
        screen.getByRole('textbox', { name: /Search/i }),
        'Install',
      );
      expect(
        fixture.debugElement.queryAll(RowComponentTesting.by()),
      ).toHaveLength(1);
    });
  });

  describe('When typing a description and clicking on add a new ticket', () => {
    describe('Given a success answer from API', () => {
      it('Then ticket with the description is added to the list with unassigned status', async () => {
        const { fixture } = await setup();
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

        const row = fixture.debugElement.query(
          RowComponentTesting.by({ text: /Description:? Test123/i }),
        );
        expect(row).not.toBeNil();
        expect(row!.nativeElement.textContent).toMatch(
          /.*Assignee:? Unassigned.*/i,
        );
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        class TestBackendService
          extends FakeBackendService
          implements Pick<BackendService, 'newTicket'>
        {
          newTicket = () => throwError(() => new Error('Network error'));
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

        expect(
          within(fixture.debugElement.nativeElement).getByText(
            /Network error/i,
          ),
        ).not.toBeNil();
      });
    });
  });

  describe('When assigning first ticket to george', () => {
    describe('Given a success answer from API', () => {
      it('Then first ticket is assigned to George', async () => {
        class TestBackendService
          extends FakeBackendService
          implements Pick<BackendService, 'assign'>
        {
          assign(ticketId: number, userId: number) {
            const ticket = TICKETS.find((ticket) => ticket.id === ticketId);
            expect(ticket).not.toBeNil();
            const updatedTicket = { ...ticket!, assigneeId: userId };
            return of(updatedTicket);
          }
        }

        const { fixture, harnessEnv } = await setup({
          backendService: new TestBackendService(),
        });

        let row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        const rowTesting = new RowComponentTesting(harnessEnv, row);
        await rowTesting.assignTo(/George/i);

        row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        expect(row!.nativeElement.textContent).toMatch(
          /.*Assignee:? George.*/i,
        );
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        class TestBackendService
          extends FakeBackendService
          implements Pick<BackendService, 'assign'>
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          assign(_ticketId: number, _userId: number) {
            return throwError(() => new Error('Network error'));
          }
        }

        const { fixture, harnessEnv } = await setup({
          backendService: new TestBackendService(),
        });

        const row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        const rowTesting = new RowComponentTesting(harnessEnv, row);
        await rowTesting.assignTo(/George/i);
        expect(
          within(fixture.debugElement.nativeElement).getByText(
            /Network error/i,
          ),
        ).not.toBeNil();
      });
    });
  });

  describe('When finishing first ticket', () => {
    describe('Given a success answer from API', () => {
      it('Then first ticket is done', async () => {
        class TestBackendService
          extends FakeBackendService
          implements Pick<BackendService, 'complete'>
        {
          complete(
            ticketId: number,
            completed: boolean,
          ): Observable<{
            assigneeId: number | null;
            description: string;
            completed: boolean;
            id: number;
          }> {
            const ticket = TICKETS.find((ticket) => ticket.id === ticketId);
            expect(ticket).not.toBeNil();
            const updatedTicket = { ...ticket!, completed };
            return of(updatedTicket);
          }
        }

        const { fixture, harnessEnv } = await setup({
          backendService: new TestBackendService(),
        });

        let row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        expect(row!.nativeElement.textContent).toMatch(/.*Done:? false.*/i);
        const rowTesting = new RowComponentTesting(harnessEnv, row);
        await rowTesting.markDone();

        row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        expect(row!.nativeElement.textContent).toMatch(/.*Done:? true.*/i);
      });
    });

    describe('Given a failure answer from API', () => {
      it('Then an error is displayed at the bottom of the list', async () => {
        class TestBackendService
          extends FakeBackendService
          implements Pick<BackendService, 'complete'>
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          complete(
            _ticketId: number,
            _completed: boolean,
          ): Observable<{
            assigneeId: number | null;
            description: string;
            completed: boolean;
            id: number;
          }> {
            return throwError(() => new Error('Network error'));
          }
        }

        const { fixture, harnessEnv } = await setup({
          backendService: new TestBackendService(),
        });

        const row = fixture.debugElement.query(
          RowComponentTesting.by({
            text: /Description:? Install a monitor arm/i,
          }),
        );
        expect(row).not.toBeNil();
        expect(row!.nativeElement.textContent).toMatch(/.*Done:? false.*/i);
        const rowTesting = new RowComponentTesting(harnessEnv, row);
        await rowTesting.markDone();
        expect(
          within(fixture.debugElement.nativeElement).getByText(
            /Network error/i,
          ),
        ).not.toBeNil();
      });
    });
  });

  describe('When clicking on first ticket', () => {
    it('Then we navigate to detail/0', async () => {
      const { fixture } = await setup({
        backendService: new FakeBackendService(),
      });

      const navigateByUrl = jest
        .spyOn(Router.prototype, 'navigateByUrl')
        .mockImplementation((x) => {
          expect(x.toString().startsWith('/detail')).toBe(true);
          return Promise.resolve(true);
        });

      const row = fixture.debugElement.query(
        RowComponentTesting.by({
          text: /Description:? Install a monitor arm/i,
        }),
      );
      expect(row).not.toBeNil();
      await user.click(within(row.nativeElement).getByText(/Ticket/i));
      expect(navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });
});
