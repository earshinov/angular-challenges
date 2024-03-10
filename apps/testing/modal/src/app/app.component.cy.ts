import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  const setup = () => {
    cy.mount(AppComponent, {
      providers: [provideNoopAnimations()],
    });
  };

  test('error modal is displayed if you click on "Confirm" without inputing a name', () => {
    setup();
    cy.findByRole('textbox', { name: 'Name' }).should('have.value', '');
    cy.findByRole('button', { name: 'Confirm' }).click();

    const errorDialog = cy.findByRole('dialog', { name: 'Error' });
    errorDialog.should('contain.text', 'You must enter a name');
    errorDialog.findByRole('button', { name: 'OK' }).click();
  });

  test('error message is shown if you click "Cancel" in the confirmation modal after submitting a name', () => {
    setup();
    cy.findByRole('textbox', { name: 'Name' }).type('John Smith');
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.findByRole('dialog', { name: 'Error' }).should('not.exist');

    const profileDialog = cy.findByRole('dialog', { name: 'Profil' });
    profileDialog.findByRole('button', { name: 'Cancel' }).click();

    cy.findByText(/Name is invalid/).should('exist');
  });

  test('confirm message is shown if you click "Confirm" in the confirmation modal after submitting a name', () => {
    setup();
    cy.findByRole('textbox', { name: 'Name' }).type('John Smith');
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.findByRole('dialog', { name: 'Error' }).should('not.exist');

    const profileDialog = cy.findByRole('dialog', { name: 'Profil' });
    profileDialog.findByRole('button', { name: 'Confirmation' }).click();

    cy.findByText(/Name has been submitted/).should('exist');
  });
});
