import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteService } from '../../../services';
import { WebsitePageData, PageSection } from '../../../models';
import { HeroSliderComponent } from '../sections/hero-slider.component';
import { NineGridCategoryComponent } from '../sections/nine-grid-category.component';
import { FeatureIntroComponent } from '../sections/feature-intro.component';
import { CategoryProductsComponent } from '../sections/category-products.component';

@Component({
  selector: 'app-storefront-home',
  imports: [
    CommonModule,
    HeroSliderComponent,
    NineGridCategoryComponent,
    FeatureIntroComponent,
    CategoryProductsComponent
  ],
  template: `
    <div class="storefront-home">
      @if (loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading page...</p>
        </div>
      } @else if (error()) {
        <div class="error-container">
          <p>Error loading page: {{ error() }}</p>
          <button (click)="loadPageData()" class="retry-btn">Retry</button>
        </div>
      } @else {
        <!-- Render page sections dynamically -->
        @for (section of pageSections(); track section.id) {
          <div
            class="page-section"
            [attr.data-section-type]="section.type"
            [ngStyle]="getSectionStyles(section, 'pc')"
          >
            @switch (section.type) {
              @case ('hero-slider') {
                <app-hero-slider [section]="section"></app-hero-slider>
              }
              @case ('nine-grid-category') {
                <app-nine-grid-category [section]="section"></app-nine-grid-category>
              }
              @case ('feature-intro1') {
                <app-feature-intro [section]="section"></app-feature-intro>
              }
              @case ('category-with-products') {
                <app-category-products [section]="section"></app-category-products>
              }
              @default {
                <div class="unknown-section p-8 bg-gray-100 text-center">
                  <p class="text-gray-600">Unknown section type: {{ section.type }}</p>
                  <p class="text-sm text-gray-500">Section ID: {{ section.id }}</p>
                </div>
              }
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .storefront-home {
      min-height: 100vh;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 1rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .retry-btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .retry-btn:hover {
      background: #2563eb;
    }

    .page-section {
      width: 100%;
    }

    .unknown-section {
      padding: 2rem;
      text-align: center;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fbbf24;
    }

    .hero-slider-placeholder,
    .nine-grid-placeholder,
    .feature-intro-placeholder,
    .category-products-placeholder {
      padding: 2rem;
      text-align: center;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      margin: 1rem 0;
    }

    .hero-slider-placeholder h2,
    .nine-grid-placeholder h2,
    .feature-intro-placeholder h2,
    .category-products-placeholder h2 {
      margin: 0 0 1rem 0;
      color: #374151;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .page-section {
        /* Mobile-specific styles will be applied via ngStyle */
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .page-section {
        /* Tablet-specific styles will be applied via ngStyle */
      }
    }
  `]
})
export class StorefrontHomeComponent implements OnInit {
  private readonly websiteService = inject(WebsiteService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly pageData = signal<WebsitePageData | null>(null);
  readonly pageSections = signal<PageSection[]>([]);

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load home page data
    this.websiteService.getHomePageData(2).subscribe({ // company_id: 2 from your example
      next: (data: WebsitePageData[]) => {
        if (data && data.length > 0) {
          const homePageData = data[0];
          this.pageData.set(homePageData);
          this.pageSections.set(homePageData.data.sections || []);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load page data');
        this.loading.set(false);
        console.error('Error loading page data:', err);
      }
    });
  }

  getSectionStyles(section: PageSection, device: 'pc' | 'mobile' | 'tablet'): any {
    return section.styles[device] || {};
  }

  // Helper method to get responsive styles based on screen size
  getCurrentDeviceStyles(section: PageSection): any {
    // This is a simple implementation - you might want to use Angular CDK for proper breakpoint detection
    const width = window.innerWidth;

    if (width <= 768) {
      return { ...section.styles.pc, ...section.styles.mobile };
    } else if (width <= 1024) {
      return { ...section.styles.pc, ...section.styles.tablet };
    } else {
      return section.styles.pc;
    }
  }
}
