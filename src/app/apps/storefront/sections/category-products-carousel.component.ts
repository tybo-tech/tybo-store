import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  computed,
  signal,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';
import { CategoryService } from '../../../services/category.service';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'app-category-products-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      [ngStyle]="sectionStyles()"
      [ngClass]="[sectionClass(), containerClassName()]"
    >
      <div class="container mx-auto px-4 py-8">
        <!-- Loading State -->
        @if (isLoading()) {
        <div class="flex justify-center items-center py-12 theme-muted">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading category...
        </div>
        }

        <!-- Error State -->
        @if (errorMsg()) {
        <div class="theme-error rounded-lg p-4 mb-8 border">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-3"></i>
            <div>
              <h3 class="font-medium">Failed to load category</h3>
              <p class="text-sm opacity-80">{{ errorMsg() }}</p>
            </div>
          </div>
        </div>
        }

        <!-- Category Content -->
        @if (!isLoading() && !errorMsg() && categoryData()) {
        <!-- Breadcrumb Trail -->
        @if (breadcrumbTrail().length > 0) {
        <nav class="mb-6">
          <ol class="flex items-center space-x-2 text-sm theme-muted">
            @for (crumb of breadcrumbTrail(); track crumb.id; let isLast =
            $last) {
            <li class="flex items-center">
              @if (!isLast) {
              <span class="hover:opacity-80 cursor-pointer theme-text">{{
                crumb.name
              }}</span>
              <i class="fas fa-chevron-right mx-2 text-xs"></i>
              } @else {
              <span class="theme-text font-medium">{{ crumb.name }}</span>
              }
            </li>
            }
          </ol>
        </nav>
        }

        <!-- Category Header -->
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center gap-6">
            <div class="flex-1">
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {{ categoryData()?.name }}
              </h1>
              @if (categoryData()?.description) {
              <p class="text-gray-600 text-sm lg:text-base leading-relaxed">
                {{ categoryData()?.description }}
              </p>
              }
            </div>
          </div>
        </div>

        <!-- Products Section -->
        @if (products().length > 0) {
        <!-- Products Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold theme-text">
            Products ({{ products().length }})
          </h2>
          <div class="flex items-center space-x-2">
            <button
              (click)="scrollLeft()"
              [disabled]="!canScrollLeft()"
              class="w-8 h-8 rounded-full theme-btn-nav flex items-center justify-center transition-colors"
            >
              <i class="fas fa-chevron-left text-sm"></i>
            </button>
            <button
              (click)="scrollRight()"
              [disabled]="!canScrollRight()"
              class="w-8 h-8 rounded-full theme-btn-nav flex items-center justify-center transition-colors"
            >
              <i class="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Horizontal Scrolling Products -->
        <div class="relative">
          <div
            #productsContainer
            class="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style="scroll-behavior: smooth;"
            (scroll)="onScroll()"
          >
            @for (product of products(); track product.id) {
            <div
              class="flex-none w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              <!-- Product Image -->
              <div class="relative aspect-square overflow-hidden">
                <img
                  [src]="product.image_url || defaultProductImage"
                  [alt]="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                @if (product.on_sale) {
                <div
                  class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Sale
                </div>
                } @if (product.featured) {
                <div
                  class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  Featured
                </div>
                }

                <!-- Quick Action Buttons -->
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <div class="flex space-x-2">
                    <button
                      (click)="onQuickView(product)"
                      class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Quick View"
                    >
                      <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button
                      (click)="onAddToWishlist(product)"
                      class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Add to Wishlist"
                    >
                      <i class="fas fa-heart text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3
                  class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                >
                  {{ product.name }}
                </h3>

                @if (product.description) {
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  {{ product.description }}
                </p>
                }

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold theme-text">
                      ZAR{{ product.price }}
                    </span>
                  </div>

                  <button
                    (click)="onAddToCart(product)"
                    class="px-4 py-2 theme-primary text-sm rounded transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>

                @if (product.quantity !== undefined) {
                <div class="mt-2 text-xs theme-muted">
                  @if (product.quantity > 0) {
                  {{ product.quantity }} in stock } @else { Out of stock }
                </div>
                }
              </div>
            </div>
            }
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-8">
          <button
            (click)="onViewAllClick()"
            class="px-8 py-3 theme-primary rounded-lg transition-colors font-medium"
          >
            View All {{ categoryData()?.name }} Products
          </button>
        </div>
        } @else {
        <div class="text-center theme-muted py-12">
          No products found in this category.
        </div>
        } }
      </div>
    </section>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      .aspect-square {
        aspect-ratio: 1 / 1;
      }

      /* Theme-based styles using CSS variables */
      .theme-text {
        color: var(--color-text, #5e5e5e);
      }

      .theme-muted {
        color: var(--color-muted, #6c757d);
      }

      .theme-primary {
        background-color: var(--color-primary, #a38245);
        color: var(--color-surface, #ffffff);
      }

      .theme-primary:hover {
        background-color: var(--color-primary, #a38245);
        opacity: 0.9;
      }

      .theme-secondary {
        background-color: var(--color-secondary, #d6d6d6);
        color: var(--color-text, #5e5e5e);
      }

      .theme-secondary:hover {
        background-color: var(--color-secondary, #d6d6d6);
        opacity: 0.9;
      }

      .theme-surface {
        background-color: var(--color-surface, #ffffff);
        color: var(--color-text, #5e5e5e);
      }

      .theme-border {
        border-color: var(--color-border, #dcdcdc);
      }

      .theme-error {
        color: var(--color-error, #dc3545);
        background-color: color-mix(in srgb, var(--color-error, #dc3545) 10%, var(--color-surface, #ffffff));
        border-color: color-mix(in srgb, var(--color-error, #dc3545) 20%, var(--color-surface, #ffffff));
      }

      .theme-success {
        background-color: var(--color-success, #28a745);
        color: var(--color-surface, #ffffff);
      }

      .theme-warning {
        background-color: var(--color-warning, #ffc107);
        color: var(--color-text, #5e5e5e);
      }

      /* Button and interaction styles */
      .theme-btn-nav {
        background-color: var(--color-secondary, #d6d6d6);
        color: var(--color-text, #5e5e5e);
      }

      .theme-btn-nav:hover:not(:disabled) {
        background-color: var(--color-primary, #a38245);
        color: var(--color-surface, #ffffff);
      }

      .theme-btn-nav:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class CategoryProductsCarouselComponent implements OnInit, OnChanges {
  @Input() section!: PageSection;
  @ViewChild('productsContainer')
  productsContainer!: ElementRef<HTMLDivElement>;

  private categoryService = inject(CategoryService);
  private contextService = inject(ContextService);

  defaultProductImage =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';

  private _categoryData = signal<any>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _scrollState = signal({
    canScrollLeft: false,
    canScrollRight: false,
  });

  isLoading = computed(() => this._loading());
  errorMsg = computed(() => this._error());
  categoryData = computed(() => this._categoryData());

  // Extract products from category data
  products = computed(() => {
    const category = this.categoryData();
    return category?.products || [];
  });

  // Extract breadcrumb trail
  breadcrumbTrail = computed(() => {
    const category = this.categoryData();
    return category?.trail || [];
  });

  // CSS-safe class names for storefront style manager
  private sanitizeId(id?: string) {
    return (id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
  }
  sectionClass = computed(() => `sec-${this.sanitizeId(this.section?.id)}`);
  containerClassName = computed(
    () => `cont-${this.sanitizeId(this.section?.container?.id)}`
  );

  sectionStyles = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return {
      ...(styles['backgroundColor'] && {
        'background-color': styles['backgroundColor'],
      }),
      ...(styles['padding'] && { padding: styles['padding'] }),
      ...(styles['margin'] && { margin: styles['margin'] }),
    };
  });

  // Scroll state
  canScrollLeft = computed(() => this._scrollState().canScrollLeft);
  canScrollRight = computed(() => this._scrollState().canScrollRight);

  ngOnInit(): void {
    this.loadCategoryData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section']) {
      this.loadCategoryData();
    }
  }

  private loadCategoryData(): void {
    // Extract categoryId from section content
    let categoryId: number | undefined;
    try {
      const content = this.section?.container?.children?.[0]?.content || [];
      const entry = Array.isArray(content)
        ? content.find((c: any) => c.categoryId || c.category_id || c.value)
        : null;
      const raw = entry?.categoryId || entry?.category_id || entry?.value;
      if (raw !== undefined && raw !== null && raw !== '') {
        const parsed = parseInt(String(raw), 10);
        if (!isNaN(parsed)) categoryId = parsed;
      }
    } catch {}

    if (!categoryId) {
      this._error.set('No category ID found in section content');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.categoryService.getCategoryWithProducts(categoryId).subscribe({
      next: (categoryData: any) => {
        this._categoryData.set(categoryData);
        this._loading.set(false);
        // Update scroll state after data loads
        setTimeout(() => this.updateScrollState(), 100);
      },
      error: (err) => {
        console.error('Failed to load category', err);
        this._error.set('Could not load category data.');
        this._loading.set(false);
      },
    });
  }

  // Scroll functionality
  scrollLeft(): void {
    if (this.productsContainer) {
      const container = this.productsContainer.nativeElement;
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.productsContainer) {
      const container = this.productsContainer.nativeElement;
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  onScroll(): void {
    this.updateScrollState();
  }

  private updateScrollState(): void {
    if (this.productsContainer) {
      const container = this.productsContainer.nativeElement;
      const canScrollLeft = container.scrollLeft > 0;
      const canScrollRight =
        container.scrollLeft < container.scrollWidth - container.clientWidth;

      this._scrollState.set({ canScrollLeft, canScrollRight });
    }
  }

  // Product actions
  onQuickView(product: any) {
    console.log('Quick view:', product);
    // TODO: Open product quick view modal
  }

  onAddToWishlist(product: any) {
    console.log('Add to wishlist:', product);
    // TODO: Add to wishlist functionality
  }

  onAddToCart(product: any) {
    console.log('Add to cart:', product);
    // TODO: Add to cart functionality
  }

  onViewAllClick() {
    console.log(
      'View all products clicked for category:',
      this.categoryData()?.name
    );
    // TODO: Navigate to category listing page
  }
}
