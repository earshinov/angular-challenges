import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { MySliderHarness } from './slider.harness';

async function setup() {
  const { fixture } = await render(AppComponent);
  const harnessLoader = TestbedHarnessEnvironment.loader(fixture);
  const [slider1, slider2] =
    await harnessLoader.getAllHarnesses(MySliderHarness);
  return { slider1, slider2 };
}

describe('AppComponent', () => {
  describe('When clicking 2 times on plus button of first slider', () => {
    test('Then value is 16', async () => {
      const { slider1 } = await setup();
      await slider1.clickPlus();
      await slider1.clickPlus();
      expect(await slider1.getValue()).toStrictEqual(16);
    });
  });

  describe('When clicking 1 time on plus button and two times on minus button of first slider', () => {
    test('Then value is still 10', async () => {
      const { slider1 } = await setup();
      expect(await slider1.getMinValue()).toStrictEqual(10);
      await slider1.clickPlus();
      await slider1.clickMinus();
      await slider1.clickMinus();
      expect(await slider1.getValue()).toStrictEqual(10);
    });
  });

  describe('When clicking 4 times on plus button of slider 1', () => {
    test('Then slider 2 is enabled', async () => {
      const { slider1, slider2 } = await setup();
      expect(await slider2.disabled()).toStrictEqual(true);
      expect(await slider1.getMinValue()).toStrictEqual(10);
      for (let _ of new Array(4)) await slider1.clickPlus();
      expect(await slider2.disabled()).toStrictEqual(false);
    });
  });
});
