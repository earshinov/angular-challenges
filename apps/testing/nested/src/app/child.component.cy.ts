import { TestBed } from '@angular/core/testing';
import { ChildComponent } from './child.component';
import { HttpService } from './http.service';

describe('ChildComponent', () => {
  const setup = () => {
    cy.mount(ChildComponent).then(() => {
      const http = TestBed.inject(HttpService);
      cy.stub(http, 'sendTitle').as('http');
    });
  };
  describe('When typing nothing and clicking on Validate', () => {
    test('Then show "Title is required" error message and no http request has been sent', async () => {
      setup();
      cy.findByRole('button', { name: 'Validate' }).click();
      cy.findByText(/Title is required/i).should('exist');
      cy.get('@http').should('not.be.called');
    });
  });
  describe('When typing "Good" and clicking on Validate', () => {
    test('Then show "Title is Good" message, no error message and send a http request to the backend', async () => {
      setup();
      cy.findByRole('textbox').type('Good');
      cy.findByText(/Title is Good/i).should('contain.text', 'Good');
      cy.findByRole('button', { name: 'Validate' }).click();
      cy.findByText(/Title is required/i).should('not.exist');
      cy.get('@http').should('be.called');
    });
  });
});
