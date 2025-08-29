import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorefrontPageComponent } from '../apps/storefront/pages/storefront-page.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    StorefrontPageComponent
  ],
  template: `
    <app-storefront-page
      pageId="checkout"
      [companyId]="2"
      pageTitle="Shopping Cart - Mayanda Empire">
    </app-storefront-page>
  `
})
export class CartPageComponent {
}
