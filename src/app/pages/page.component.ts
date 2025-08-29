import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StorefrontPageComponent } from '../apps/storefront/pages/storefront-page.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    CommonModule,
    StorefrontPageComponent
  ],
  template: `
    @if (pageId) {
      <app-storefront-page
        [pageId]="pageId"
        [companyId]="2"
        [pageTitle]="getPageTitle(pageId)">
      </app-storefront-page>
    }
  `
})
export class PageComponent {
  private route = inject(ActivatedRoute);

  pageId = this.route.snapshot.paramMap.get('pageId') || '';

  getPageTitle(pageId: string): string {
    const titles: Record<string, string> = {
      'home': 'Home - Mayanda Empire',
      'products': 'Products - Mayanda Empire',
      'about-us': 'About Us - Mayanda Empire',
      'contact-us': 'Contact Us - Mayanda Empire',
      'login': 'Login - Mayanda Empire',
      'account': 'My Account - Mayanda Empire',
      'checkout': 'Checkout - Mayanda Empire'
    };

    return titles[pageId] || `${pageId} - Mayanda Empire`;
  }
}
