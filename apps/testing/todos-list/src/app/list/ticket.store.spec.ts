import { Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render } from '@testing-library/angular';
import { Observable, of, throwError } from 'rxjs';
import { TICKETS, TICKET_ASSIGNED, USERS } from '../../../test/data';
import { BackendService, Ticket, TicketUser } from '../backend.service';
import { ListComponent } from './list.component';
import { TicketStore } from './ticket.store';

async function setup({
  backendService = {},
}: {
  backendService?: Partial<BackendService>;
} = {}) {
  await TestBed.configureTestingModule({
    imports: [ListComponent, NoopAnimationsModule],
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

  const ticketStore = fixture.componentRef.injector.get(TicketStore);
  return { fixture, ticketStore };
}

function getAssignedTicket(
  ticketStore: TicketStore,
  injector: Injector,
): Ticket | TicketUser {
  const tickets = toSignal(ticketStore.tickets$, {
    injector,
    requireSync: true,
  })();
  const ticket = tickets.find((ticket) => ticket.id === TICKET_ASSIGNED.id) as
    | Ticket
    | TicketUser;
  expect(ticket).not.toBeNil();
  return ticket;
}

describe('TicketStore', () => {
  describe('When init', () => {
    it('Then calls backend.users and backend.tickets', async () => {
      let usersMock, ticketsMock: jest.Func;
      const backendService: Partial<BackendService> = {
        users: (usersMock = jest.fn(() => of(USERS))),
        tickets: (ticketsMock = jest.fn(() => of(TICKETS))),
      };
      await setup({
        backendService,
      });
      expect(usersMock).toHaveBeenCalledTimes(1);
      expect(ticketsMock).toHaveBeenCalledTimes(1);
    });

    describe('Given all api returns success response', () => {
      it('Then tickets and users should be merged ', async () => {
        const backendService: Partial<BackendService> = {
          users: () => of(USERS),
          tickets: () => of(TICKETS),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fixture, ticketStore } = await setup({
          backendService,
        });

        const state = ticketStore.state();
        expect(state.tickets).toEqual(TICKETS);
        expect(state.users).toEqual(USERS);

        const assignedTicket = getAssignedTicket(
          ticketStore,
          fixture.componentRef.injector,
        );
        const user = USERS.find(
          (user) => user.id === TICKET_ASSIGNED.assigneeId,
        );
        expect(user).not.toBeNil();
        expect((assignedTicket as TicketUser).assignee).toEqual(user!.name);
      });
    });

    describe('Given users api returns failure response', () => {
      it('Then tickets should not have any assignee', async () => {
        const backendService: Partial<BackendService> = {
          users: jest.fn(() => throwError(() => new Error('Network error'))),
          tickets: jest.fn(() => of(TICKETS)),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ticketStore, fixture } = await setup({
          backendService,
        });

        const assignedTicket = getAssignedTicket(
          ticketStore,
          fixture.componentRef.injector,
        );
        expect((assignedTicket as TicketUser).assignee).toBeNil();
      });
    });

    describe('When adding a new ticket with success', () => {
      it('Then ticket is added to the list', async () => {
        const backendService: Partial<BackendService> = {
          users: () => of(USERS),
          tickets: () => of(TICKETS),
          newTicket: ({ description }): Observable<Ticket> => {
            return of({
              id: 42,
              description,
              assigneeId: null,
              completed: false,
            });
          },
        };
        const { fixture, ticketStore } = await setup({
          backendService,
        });

        ticketStore.addTicket('Test123');
        await fixture.whenStable();
        expect(ticketStore.state().tickets).toHaveLength(TICKETS.length + 1);
        expect(ticketStore.state().tickets.at(-1)!.description).toEqual(
          'Test123',
        );
      });
    });
  });
});
