import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChildComponent } from './child.component';

let fixture: ComponentFixture<ChildComponent>;
let loader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.configureTestingModule({
    imports: [NoopAnimationsModule],
  }).createComponent(ChildComponent);
  loader = TestbedHarnessEnvironment.loader(fixture);
});

// https://github.com/angular/components/pull/28494
//afterEach(() => {
//  fixture.detectChanges();
//});

describe('ChildComponent', () => {
  describe('When init', () => {
    test('Then show 1 slider, 3 checkboxes, 4 inputs, 2 buttons', async () => {
      expect(await loader.getAllHarnesses(MatSliderHarness)).toHaveLength(1);
      expect(await loader.getAllHarnesses(MatCheckboxHarness)).toHaveLength(3);
      expect(await loader.getAllHarnesses(MatInputHarness)).toHaveLength(4);
      expect(await loader.getAllHarnesses(MatButtonHarness)).toHaveLength(2);
    });

    test('Then initial value of slider thumb is 0', async () => {
      const slider = await loader.getHarness(MatSliderHarness);
      expect(await (await slider.getEndThumb()).getValue()).toBe(0);
    });
  });

  describe('Given maxValue set to 109', () => {
    test('Then slider max value is 109', async () => {
      const maxValueInput = await loader.getHarness(
        MatInputHarness.with({ selector: '#input-max' }),
      );
      await maxValueInput.setValue(String(109));

      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getMaxValue()).toBe(109);
    });
  });

  describe('When disabled checkbox is toggled', () => {
    test('Then slider is disabled', async () => {
      const disabledCheckbox = await loader.getHarness(
        MatCheckboxHarness.with({ label: 'Disabled' }),
      );
      await disabledCheckbox.check();

      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.isDisabled()).toBe(true);
    });
  });

  describe('Given step value set to 5, and When clicking on forward button two times', () => {
    test('Then thumb value is 10', async () => {
      const stepInput = await loader.getHarness(
        MatInputHarness.with({ selector: '#input-step' }),
      );
      await stepInput.setValue(String(5));

      const forwardButton = (await loader.getAllHarnesses(MatButtonHarness))[1];
      await forwardButton.click();
      await forwardButton.click();

      const slider = await loader.getHarness(MatSliderHarness);
      expect(await (await slider.getEndThumb()).getValue()).toBe(10);
    });
  });

  describe('Given slider value set to 5, and step value to 6 and When clicking on back button', () => {
    test('Then slider value is still 5', async () => {
      const slider = await loader.getHarness(MatSliderHarness);
      await (await slider.getEndThumb()).setValue(5);

      const stepInput = await loader.getHarness(
        MatInputHarness.with({ selector: '#input-step' }),
      );
      await stepInput.setValue(String(6));

      const backButton = (await loader.getAllHarnesses(MatButtonHarness))[0];
      await backButton.click();
      await backButton.click();

      expect(await (await slider.getEndThumb()).getValue()).toBe(5);
    });
  });
});
