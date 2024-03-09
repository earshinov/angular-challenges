import { render, screen } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { ChildComponent } from './child.component';
import { HttpService } from './http.service';

describe('ChildComponent', () => {
  describe('When typing nothing and clicking on Validate', () => {
    test('Then show "Title is required" error message and no http request has been sent', async () => {
      const { http } = await renderChildComponent();
      await user.click(screen.getByRole('button', { name: 'Validate' }));
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(http.sendTitle).not.toBeCalled();
    });
  });

  describe('When typing "Good" and clicking on Validate', () => {
    test('Then show "Title is Good" message, no error message and send a http request to the backend', async () => {
      const { http } = await renderChildComponent();
      await user.type(screen.getByRole('textbox'), 'Good');
      expect(screen.getByText(/Title is Good/i)).toHaveTextContent(/Good/); // Must exist and preserve case
      await user.click(screen.getByRole('button', { name: 'Validate' }));
      expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
      expect(http.sendTitle).toBeCalledTimes(1);
      expect(http.sendTitle).toBeCalledWith('Good');
    });
  });
});

class MockHttpService implements HttpService {
  sendTitle = jest.fn();
}

async function renderChildComponent() {
  const http = new MockHttpService();
  const renderResult = await render(ChildComponent, {
    providers: [
      {
        provide: HttpService,
        useValue: http,
      },
    ],
  });
  return { ...renderResult, http };
}
