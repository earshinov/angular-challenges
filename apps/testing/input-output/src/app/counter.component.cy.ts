import { createOutputSpy } from 'cypress/angular';
import { CounterComponent } from './counter.component';

function setup() {
  cy.mount(CounterComponent, {
    componentProperties: {
      initialValue: 10,
      send: createOutputSpy('send'),
    },
    // or `autoSpyOutputs: true` and use '@sendSpy' instead of '@send' below
  });
}

describe(CounterComponent.name, () => {
  describe('Given an initualValue of 10', () => {
    test('Then counterValue is 10', async () => {
      setup();
      cy.findByText(/Counter: /i).should('have.text', /Counter: 10/i);
    });
  });

  describe('When clicking 5 times on increment button', () => {
    test('Then counterValue is 15', async () => {
      setup();
      for (const _ of new Array(5))
        cy.findByRole('button', { name: 'Increment' }).click();
      cy.findByText(/Counter: /i).should('have.text', /Counter: 15/i);
    });
  });

  describe('When clicking 2 times on decrement button', () => {
    test('Then counterValue is 8 and emitted value is 8', async () => {
      setup();
      for (const _ of new Array(2))
        cy.findByRole('button', { name: 'Decrement' }).click();
      cy.findByText(/Counter: /i).should('have.text', /Counter: 8/i);
      cy.findByRole('button', { name: 'Send' }).click();
      cy.get('@send').should('have.been.calledOnceWith', 8);
    });
  });
});
