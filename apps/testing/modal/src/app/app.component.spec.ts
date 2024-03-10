import { render, screen, within } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  test('error modal is displayed if you click on "Confirm" without inputing a name', async () => {
    await render(AppComponent);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    const errorDialog = screen.getByRole('dialog', { name: 'Error' });
    expect(errorDialog).toHaveTextContent(/You must enter a name/);
    await user.click(within(errorDialog).getByRole('button', { name: 'OK' }));
  });

  test('error message is shown if you click "Cancel" in the confirmation modal after submitting a name', async () => {
    await render(AppComponent);
    await user.type(
      screen.getByRole('textbox', { name: 'Name' }),
      'John Smith',
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(
      screen.queryByRole('dialog', { name: 'Error' }),
    ).not.toBeInTheDocument();

    const profileDialog = screen.getByRole('dialog', { name: 'Profil' });
    await user.click(
      within(profileDialog).getByRole('button', { name: 'Cancel' }),
    );

    expect(screen.getByText(/Name is invalid/)).toBeInTheDocument();
  });

  test('confirm message is shown if you click "Confirm" in the confirmation modal after submitting a name', async () => {
    await render(AppComponent);
    await user.type(
      screen.getByRole('textbox', { name: 'Name' }),
      'John Smith',
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(
      screen.queryByRole('dialog', { name: 'Error' }),
    ).not.toBeInTheDocument();

    const profileDialog = screen.getByRole('dialog', { name: 'Profil' });
    await user.click(
      within(profileDialog).getByRole('button', { name: 'Confirmation' }),
    );

    expect(screen.getByText(/Name has been submitted/)).toBeInTheDocument();
  });
});
