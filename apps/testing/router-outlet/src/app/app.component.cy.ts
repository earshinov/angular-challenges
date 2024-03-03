import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

const selectors = {
  borrowButton() {
    return cy.get('button').contains('Borrow');
  },
  searchInput() {
    return cy
      .get('label')
      .contains(/Search book/i)
      .find('input');
  },
};

const actions = {
  async searchBy(text: string) {
    selectors.searchInput().focus().type(text);
    selectors.borrowButton().click();
  },
  async checkEntries(expectedEntries: RegExp[]) {
    cy.find('li')
      .should('have.length', expectedEntries.length)
      .each((actual, i) => {
        expect(actual.text()).to.match(expectedEntries[i]);
      });
  },
};

beforeEach(() => {
  cy.mount(AppComponent, {
    providers: [provideRouter(appRoutes)],
  });
});

describe('AppComponent', () => {
  describe('Given no search criteria', () => {
    it('Then shows error message and disabled button', async () => {
      cy.find('div')
        .contains(/Search criteria is required!/)
        .should('not.be.null');
      selectors.borrowButton().should('not.be.disabled');
    });
  });

  describe('Given a search criteria with no book match', () => {
    it('Then shows No book found', async () => {
      actions.searchBy('Crap');
      cy.find('div')
        .contains(/No book found/)
        .should('not.be.null');
    });
  });

  describe('Given a search criteria with one book match', () => {
    it('Then shows One book and no error', async () => {
      actions.searchBy('Mockingbird');
      actions.checkEntries([/To Kill a Mockingbird/]);
    });
  });

  describe('Given a search criteria in Uppercase with one book match', () => {
    it('Then shows One book and no error', async () => {
      actions.searchBy('MOCKINGBIRD');
      actions.checkEntries([/To Kill a Mockingbird/]);
    });
  });

  describe('Given a search criteria with multple books matches', () => {
    it('Then shows a list of books', async () => {
      actions.searchBy('Tolkien');
      actions.checkEntries([/The Hobbit/, /The Lord of the Rings/]);
    });
  });
});
