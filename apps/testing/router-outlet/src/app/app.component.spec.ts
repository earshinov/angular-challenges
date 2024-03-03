import { RenderResult, render } from '@testing-library/angular';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

async function setup() {
  const app = await render(AppComponent, { routes: appRoutes });
  const user = userEvent.setup();
  return { app, user };
}

type App = RenderResult<AppComponent, AppComponent>;

function selectors(app: App) {
  return {
    async borrowButton() {
      return (await app.findByRole('button', {
        name: 'Borrow',
      })) as HTMLButtonElement;
    },
    async searchInput() {
      return (await app.findByLabelText(/Search book/i)) as HTMLInputElement;
    },
  };
}

function actions(app: App, user: UserEvent) {
  return {
    async searchBy(text: string) {
      const sel = selectors(app);
      (await sel.searchInput()).focus();
      await user.keyboard(text);
      await user.click(await sel.borrowButton());
    },
    async checkEntries(expectedEntries: (string | RegExp)[]) {
      const actualEntries = await app.findAllByText(/Borrowed book/i);
      expect(actualEntries).toHaveLength(expectedEntries.length);
      actualEntries.forEach((actual, i) => {
        const expected = expectedEntries[i];
        expect(actual!).toHaveTextContent(expected!);
      });
    },
  };
}

describe('AppComponent', () => {
  describe('Given no search criteria', () => {
    it('Then shows error message and disabled button', async () => {
      const { app } = await setup();

      expect(
        await app.findByText(/Search criteria is required!/),
      ).toBeInTheDocument();

      expect(await selectors(app).borrowButton()).toBeDisabled();
    });
  });

  describe('Given a search criteria with no book match', () => {
    it('Then shows No book found', async () => {
      const { app, user } = await setup();
      await actions(app, user).searchBy('Crap');
      expect(await app.findByText(/No book found/)).toBeInTheDocument();
    });
  });

  describe('Given a search criteria with one book match', () => {
    it('Then shows One book and no error', async () => {
      const { app, user } = await setup();
      await actions(app, user).searchBy('Mockingbird');
      await actions(app, user).checkEntries([/To Kill a Mockingbird/]);
    });
  });

  describe('Given a search criteria in Uppercase with one book match', () => {
    it('Then shows One book and no error', async () => {
      const { app, user } = await setup();
      await actions(app, user).searchBy('MOCKINGBIRD');
      await actions(app, user).checkEntries([/To Kill a Mockingbird/]);
    });
  });

  describe('Given a search criteria with multple books matches', () => {
    it('Then shows a list of books', async () => {
      const { app, user } = await setup();
      await actions(app, user).searchBy('Tolkien');
      await actions(app, user).checkEntries([
        /The Hobbit/,
        /The Lord of the Rings/,
      ]);
    });
  });
});
