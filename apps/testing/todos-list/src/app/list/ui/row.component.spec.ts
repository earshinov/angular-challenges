import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { render, within } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import {
  TICKET_ASSIGNED,
  TICKET_NOT_ASSIGNED,
  USERS,
} from '../../../../test/data';
import { HarnessEnvironment } from '../../../../test/harness-environment';
import { RowComponent } from './row.component';
import { RowComponentTesting } from './row.component.testing';

async function setup({
  ticket,
  users = USERS,
  assign,
  closeTicket,
}: {
  ticket: RowComponent['ticket'];
  users?: RowComponent['users'];
  assign?: RowComponent['assign']['emit'];
  closeTicket?: RowComponent['closeTicket']['emit'];
}) {
  await TestBed.configureTestingModule({
    imports: [RowComponent, NoopAnimationsModule],
  }).compileComponents();

  const componentOutputs: Partial<RowComponent> = {};
  if (assign)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentOutputs['assign'] = { emit: assign } as any;
  if (closeTicket)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentOutputs['closeTicket'] = { emit: closeTicket } as any;

  const { fixture } = await render(RowComponent, {
    componentInputs: { ticket, users },
    componentOutputs,
  });
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

describe('RowComponent', () => {
  describe('Given an unassigned ticket', () => {
    describe('When we assign it to titi', () => {
      it('Then assign event is emitted with ticketId 0 and userId 1', async () => {
        let assignMock: jest.Func;
        const { fixture, harnessEnv } = await setup({
          ticket: TICKET_NOT_ASSIGNED,
          assign: (assignMock = jest.fn((event) => {
            expect(event).not.toBeNil();
            if (event) {
              const { ticketId, userId } = event;
              expect(ticketId).toEqual(TICKET_NOT_ASSIGNED.id);
              expect(userId).toEqual(USERS[0].id);
            }
          })),
        });

        const rowTesting = new RowComponentTesting(
          harnessEnv,
          fixture.debugElement,
        );
        await rowTesting.assignTo(USERS[0].name);
        expect(assignMock).toBeCalledTimes(1);
      });
    });
  });

  describe('Given an assigned ticket', () => {
    describe('When we click the done button', () => {
      it('Then closeTicket event is emitted with ticketId 1 ', async () => {
        let closeTicketMock: jest.Func;
        const { fixture, harnessEnv } = await setup({
          ticket: TICKET_ASSIGNED,
          closeTicket: (closeTicketMock = jest.fn((event) => {
            expect(event).toEqual(TICKET_ASSIGNED.id);
          })),
        });

        const rowTesting = new RowComponentTesting(
          harnessEnv,
          fixture.debugElement,
        );
        await rowTesting.markDone();
        expect(closeTicketMock).toBeCalledTimes(1);
      });
    });
  });

  describe('When clicking on ticket', () => {
    it('Then navigation should be triggered with url detail/0', async () => {
      const { fixture } = await setup({
        ticket: TICKET_NOT_ASSIGNED,
      });

      const navigateByUrl = jest
        .spyOn(Router.prototype, 'navigateByUrl')
        .mockImplementation((x) => {
          expect(x.toString().startsWith('/detail')).toBe(true);
          return Promise.resolve(true);
        });

      await user.click(within(fixture.nativeElement).getByText(/Ticket/i));
      expect(navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });
});
