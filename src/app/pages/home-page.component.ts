import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorefrontPageComponent } from '../apps/storefront/pages/storefront-page.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    StorefrontPageComponent
  ],
  template: `
    <app-storefront-page
      pageId="home"
      [companyId]="2"
      pageTitle="Home - Mayanda Empire">
    </app-storefront-page>
  `
})
export class HomePageComponent {
}
