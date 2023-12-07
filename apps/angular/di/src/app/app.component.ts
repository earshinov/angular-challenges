import { TableComponent } from '@angular-challenges/angular/di';
import { AsyncPipe, NgFor } from '@angular/common';
import { Component, Directive, Input, OnChanges, Self } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';
import { Currency, CurrencyService } from './currency.service';
import { Product, products } from './product.model';

interface ProductContext {
  $implicit: Product;
}

@Directive({
  selector: 'ng-template[product]',
  standalone: true,
})
export class ProductDirective {
  static ngTemplateContextGuard(
    dir: ProductDirective,
    ctx: unknown,
  ): ctx is ProductContext {
    return true;
  }
}

@Directive({
  selector: '[provideCurrency]',
  standalone: true,
  providers: [CurrencyService],
})
export class ProvideCurrencyDirective implements OnChanges {
  @Input({ alias: 'provideCurrency', required: true })
  currencyCode!: Currency['code'];

  constructor(@Self() private currencyService: CurrencyService) {}

  ngOnChanges() {
    this.currencyService.setState({ code: this.currencyCode });
  }
}

@Component({
  standalone: true,
  imports: [
    TableComponent,
    CurrencyPipe,
    AsyncPipe,
    NgFor,
    ProductDirective,
    ProvideCurrencyDirective,
  ],
  providers: [CurrencyService],
  selector: 'app-root',
  template: `
    <table [items]="products">
      <ng-template #header>
        <tr>
          <th *ngFor="let col of displayedColumns">
            {{ col }}
          </th>
        </tr>
      </ng-template>
      <ng-template #body product let-product>
        <tr [provideCurrency]="product.currencyCode">
          <td>{{ product.name }}</td>
          <td>{{ product.priceA | currency | async }}</td>
          <td>{{ product.priceB | currency | async }}</td>
          <td>{{ product.priceC | currency | async }}</td>
        </tr>
      </ng-template>
    </table>
  `,
})
export class AppComponent {
  products = products;
  displayedColumns = ['name', 'priceA', 'priceB', 'priceC'];
}
