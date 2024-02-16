import { Component, OnInit } from '@angular/core';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { City } from '../../model/city.model';
import {
  CardComponent,
  CardHeaderTemplateDirective,
  CardItemTemplateDirective,
} from '../../ui/card/card.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      [list]="cities"
      (addItem)="addItem()"
      (deleteItem)="deleteItem($event)"
      customClass="bg-light-blue">
      <ng-template [header]>
        <img src="assets/img/city.png" width="200px" />
      </ng-template>
      <ng-template [item] [items]="cities" let-item>
        {{ item.name }}
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      ::ng-deep .bg-light-blue {
        background-color: rgba(0, 0, 250, 0.1);
      }
    `,
  ],
  imports: [
    CardComponent,
    CardHeaderTemplateDirective,
    CardItemTemplateDirective,
  ],
})
export class CityCardComponent implements OnInit {
  cities: City[] = [];

  constructor(
    private http: FakeHttpService,
    private store: CityStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((s) => this.store.addAll(s));
    this.store.cities$.subscribe((s) => (this.cities = s));
  }

  protected addItem() {
    this.store.addOne(randomCity());
  }

  protected deleteItem(id: number) {
    this.store.deleteOne(id);
  }
}
