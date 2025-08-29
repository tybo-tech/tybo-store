import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsitePageRendererComponent } from '../../../components/website-page-renderer.component';
import { DynamicNavbarComponent } from '../../../components/dynamic-navbar.component';
import { DynamicFooterComponent } from '../../../components/dynamic-footer.component';

@Component({
  selector: 'app-storefront-page',
  standalone: true,
  imports: [
    CommonModule,
    WebsitePageRendererComponent,
    DynamicNavbarComponent,
    DynamicFooterComponent
  ],
  template: `
    <div class="storefront-page">
      <!-- Dynamic Navigation -->
      <app-dynamic-navbar
        [showSearch]="true"
        [fixedPosition]="true">
      </app-dynamic-navbar>

      <!-- Dynamic Page Content -->
      <main class="flex-1">
        <app-website-page-renderer
          [pageId]="pageId"
          [companyId]="companyId"
          mode="storefront"
          [device]="device"
          [enableLazyLoading]="true"
          customClasses="storefront-content">
        </app-website-page-renderer>
      </main>

      <!-- Footer -->
      <app-dynamic-footer></app-dynamic-footer>
    </div>
  `,
  styles: [`
    .storefront-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .storefront-content {
      /* Any storefront-specific styling */
      background: #ffffff;
    }
  `]
})
export class StorefrontPageComponent {
  @Input({ required: true }) pageId!: string;
  @Input() companyId?: number;
  @Input() device: 'pc' | 'mobile' | 'tablet' = 'pc';
  @Input() pageTitle: string = 'Tybo Store';
}
