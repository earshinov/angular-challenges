import { render, screen } from '@testing-library/angular';
import { userEvent as user } from '@testing-library/user-event';
import { CounterComponent } from './counter.component';

async function renderDefault() {
  const result = await render(CounterComponent, {
    componentInputs: {
      initialValue: 10,
    },
  });
  return { ...result, component: result.fixture.componentInstance };
}

describe('CounterComponent', () => {
  describe('Given an initualValue of 10', () => {
    test('Then counterValue is 10', async () => {
      await renderDefault();
      expect(screen.getByText(/Counter: /i)).toHaveTextContent(/Counter: 10/i);
    });
  });

  describe('When clicking 5 times on increment button', () => {
    test('Then counterValue is 15', async () => {
      await renderDefault();
      for (const _ of new Array(5))
        await user.click(screen.getByRole('button', { name: 'Increment' }));
      expect(screen.getByText(/Counter: /i)).toHaveTextContent(/Counter: 15/i);
    });
  });

  describe('When clicking 2 times on decrement button', () => {
    test('Then counterValue is 8 and emitted value is 8', async () => {
      const { component } = await renderDefault();
      for (const _ of new Array(2))
        await user.click(screen.getByRole('button', { name: 'Decrement' }));
      expect(screen.getByText(/Counter: /i)).toHaveTextContent(/Counter: 8/i);

      const values: number[] = [];
      component.send.subscribe((value) => values.push(value));
      await new Promise((resolve) => window.setTimeout(resolve));
      expect(values).toEqual([]);

      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(values).toEqual([8]);
    });
  });
});
