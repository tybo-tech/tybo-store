import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorefrontPageComponent } from '../apps/storefront/pages/storefront-page.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    CommonModule,
    StorefrontPageComponent
  ],
  template: `
    <app-storefront-page
      pageId="products"
      [companyId]="2"
      pageTitle="Shop - Mayanda Empire">
    </app-storefront-page>
  `
})
export class ShopPageComponent {
}
