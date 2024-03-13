import { Ticket, User } from '../src/app/backend.service';

export const USERS: User[] = [
  { id: 1, name: 'titi' },
  { id: 2, name: 'george' },
];

export const TICKET_NOT_ASSIGNED = {
  id: 0,
  description: 'Install a monitor arm',
  assigneeId: null,
  completed: false,
};

export const TICKET_ASSIGNED = {
  id: 1,
  description: 'Coucou',
  assigneeId: 1,
  completed: false,
};

export const TICKETS: Ticket[] = [TICKET_NOT_ASSIGNED, TICKET_ASSIGNED];
