import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorefrontPageComponent } from '../apps/storefront/pages/storefront-page.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    StorefrontPageComponent
  ],
  template: `
    <app-storefront-page
      pageId="account"
      [companyId]="2"
      pageTitle="My Account - Mayanda Empire">
    </app-storefront-page>
  `
})
export class AccountPageComponent {
}
