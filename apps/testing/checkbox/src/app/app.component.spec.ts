import { render } from '@testing-library/angular';
import { logRoles, screen } from '@testing-library/dom';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  describe('When checking the checkbox', () => {
    it('Then button is enabled', async () => {
      const el = await render(AppComponent);

      console.log('Playground URL:');
      screen.logTestingPlaygroundURL();

      console.log('ARIA roles:');
      logRoles(el.debugElement.nativeElement);

      console.log('DOM:');
      screen.debug();

      console.log('Element DOM:');
      screen.debug(el.debugElement.nativeElement);
    });
  });
});
