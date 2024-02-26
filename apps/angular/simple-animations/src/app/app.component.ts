/**
 * References:
 * - https://angularindepth.com/posts/1285/in-depth-guide-into-animations-in-angular
 */

import {
  animate,
  animation,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component } from '@angular/core';

const anim = animation([
  style({ opacity: 0, transform: 'translateX(-{{dx}}px)' }),
  group([
    animate(
      '{{duration}}ms ease-in',
      style({
        opacity: 1,
      }),
    ),
    // https://easings.net/#easeOutBack
    animate(
      '{{duration}}ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      style({
        transform: 'translateX(0)',
      }),
    ),
  ]),
]);

@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  styles: `
    section {
      @apply flex flex-1 flex-col gap-5;
    }

    .list-item {
      @apply flex flex-row border-b px-5 pb-2;

      span {
        @apply flex-1;
      }
    }
  `,
  template: `
    <div class="mx-20 my-40 flex gap-5">
      <section>
        <div [@fadeIn]>
          <h3>2008</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            mollitia sequi accusantium, distinctio similique laudantium eveniet
            quidem sit placeat possimus tempore dolorum inventore corporis atque
            quae ad, nobis explicabo delectus.
          </p>
        </div>

        <div [@fadeIn]>
          <h3>2010</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            mollitia sequi accusantium, distinctio similique laudantium eveniet
            quidem sit placeat possimus tempore dolorum inventore corporis atque
            quae ad, nobis explicabo delectus.
          </p>
        </div>

        <div [@fadeIn]>
          <h4>2012</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            mollitia sequi accusantium, distinctio similique laudantium eveniet
            quidem sit placeat possimus tempore dolorum inventore corporis atque
            quae ad, nobis explicabo delectus.
          </p>
        </div>
      </section>

      <section [@stagger]>
        <div class="list-item">
          <span>Name:</span>
          <span>Samuel</span>
        </div>

        <div class="list-item">
          <span>Age:</span>
          <span>28</span>
        </div>

        <div class="list-item">
          <span>Birthdate:</span>
          <span>02.11.1995</span>
        </div>

        <div class="list-item">
          <span>City:</span>
          <span>Berlin</span>
        </div>

        <div class="list-item">
          <span>Language:</span>
          <span>English</span>
        </div>

        <div class="list-item">
          <span>Like Pizza:</span>
          <span>Hell yeah</span>
        </div>
      </section>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(
        ':enter',
        useAnimation(anim, { params: { duration: 800, dx: 400 } }),
      ),
    ]),
    trigger('stagger', [
      transition(':enter', [
        query('.list-item', [
          stagger(
            100,
            useAnimation(anim, { params: { duration: 300, dx: 200 } }),
          ),
          // 100 * (6-1) + 300 = 800
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {}
