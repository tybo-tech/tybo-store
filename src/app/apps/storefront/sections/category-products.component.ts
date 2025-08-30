import { Component, Input, OnInit, OnChanges, SimpleChanges, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [ngStyle]="sectionStyles()" [ngClass]="[sectionClass(), containerClassName()]">
      <div class="container mx-auto px-4 py-12">
        <!-- Section Header -->
        <div class="text-center mb-12">
          @if (sectionTitle()) {
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {{ sectionTitle() }}
            </h2>
          }
          @if (sectionDescription()) {
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              {{ sectionDescription() }}
            </p>
          }
        </div>

        <!-- Loading State -->
  @if (isLoading()) {
          <div class="flex justify-center items-center py-12 text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i> Loading products...
          </div>
        }

        <!-- Error State -->
  @if (errorMsg()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
              <div>
                <h3 class="text-red-800 font-medium">Failed to load products</h3>
                <p class="text-red-600 text-sm">{{ errorMsg() }}</p>
              </div>
            </div>
          </div>
        }

        <!-- Empty State -->
  @if (!isLoading() && !errorMsg() && displayedProducts().length === 0) {
          <div class="text-center text-gray-500 py-12">
            No products found.
          </div>
        }

        <!-- Category Tabs -->
        @if (categories().length > 1) {
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            @for (category of categories(); track category.id) {
              <button
                (click)="setActiveCategory(category.id)"
                [class]="categoryTabClass(category.id)"
                class="px-6 py-2 rounded-full transition-colors font-medium">
                {{ category.name }}
              </button>
            }
          </div>
        }

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of displayedProducts(); track product.id) {
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <!-- Product Image -->
              <div class="relative aspect-square overflow-hidden">
                <img
                  [src]="product.image || defaultProductImage"
                  [alt]="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy">

                @if (product.discount) {
                  <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{{ product.discount }}%
                  </div>
                }

                @if (product.isNew) {
                  <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                }

                <!-- Quick Action Buttons -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div class="flex space-x-2">
                    <button
                      (click)="onQuickView(product)"
                      class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Quick View">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      (click)="onAddToWishlist(product)"
                      class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Add to Wishlist">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {{ product.name }}
                </h3>

                @if (product.rating) {
                  <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400">
                      @for (star of getStarArray(product.rating); track $index) {
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-sm text-gray-600 ml-2">({{ product.reviewCount || 0 }})</span>
                  </div>
                }

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    @if (product.originalPrice && product.originalPrice > product.price) {
                      <span class="text-sm text-gray-500 line-through">
                        {{ '$' + product.originalPrice }}
                      </span>
                    }
                    <span class="text-lg font-bold text-gray-900">
                      {{ '$' + product.price }}
                    </span>
                  </div>

                  <button
                    (click)="onAddToCart(product)"
                    class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Load More Button -->
        @if (showLoadMore()) {
          <div class="text-center mt-8">
            <button
              (click)="loadMoreProducts()"
              class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Products
            </button>
          </div>
        }

        <!-- View All Button -->
        @if (viewAllUrl()) {
          <div class="text-center mt-8">
            <button
              (click)="onViewAllClick()"
              class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View All Products
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .aspect-square {
      aspect-ratio: 1 / 1;
    }
  `]
})
export class CategoryProductsComponent implements OnInit, OnChanges {
  @Input() section!: PageSection;

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private contextService = inject(ContextService);

  defaultProductImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  activeCategory = 'all';
  displayLimit = 8;
  private productsSignal = signal<any[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  isLoading = computed(() => this._loading());
  errorMsg = computed(() => this._error());

  // CSS-safe class names for storefront style manager
  private sanitizeId(id?: string) {
    return (id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
  }
  sectionClass = computed(() => `sec-${this.sanitizeId(this.section?.id)}`);
  containerClassName = computed(() => `cont-${this.sanitizeId(this.section?.container?.id)}`);

  sectionTitle = computed(() => {
    const titleElement = this.section?.container?.children?.find(child => child.tag === 'h2');
    return titleElement?.value || 'Featured Products';
  });

  sectionDescription = computed(() => {
    const descElement = this.section?.container?.children?.find(child => child.tag === 'p');
    return descElement?.value || 'Discover our handpicked selection of premium products';
  });

  categories = computed(() => {
    // Extract category data from section children
    const container = this.section?.container;
    if (container?.children) {
      const categoryElements = container.children.filter((child: any) => child.tag === 'select' || child.tag === 'option');
      if (categoryElements.length > 0) {
        return categoryElements.map((child: any, index: number) => ({
          id: child.value || `category-${index}`,
          name: child.value || `Category ${index + 1}`
        }));
      }
    }

    // Default categories
    return [
      { id: 'all', name: 'All Products' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'home', name: 'Home & Garden' }
    ];
  });
  // Effective products
  products = computed(() => this.productsSignal());

  filteredProducts = computed(() => {
    if (this.activeCategory === 'all') {
      return this.products();
    }
    return this.products().filter((product: any) => {
      const cat = product.category || product.category_id;
      return cat == this.activeCategory; // loose equality for string/number
    });
  });

  displayedProducts = computed(() => {
    return this.filteredProducts().slice(0, this.displayLimit);
  });

  sectionStyles = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return {
      ...(styles['backgroundColor'] && { 'background-color': styles['backgroundColor'] }),
      ...(styles['padding'] && { padding: styles['padding'] }),
      ...(styles['margin'] && { margin: styles['margin'] })
    };
  });

  viewAllUrl = computed(() => {
    const linkElement = this.section?.container?.children?.find(child => child.tag === 'a');
    return linkElement?.link || '/shop';
  });

  showLoadMore = computed(() => {
    return this.filteredProducts().length > this.displayLimit;
  });

  categoryTabClass(categoryId: string): string {
    return this.activeCategory === categoryId
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  setActiveCategory(categoryId: string) {
    this.activeCategory = categoryId;
    this.displayLimit = 8; // Reset display limit when switching categories
  }

  loadMoreProducts() {
    this.displayLimit += 8;
  }

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
    console.log('View all products clicked');
    // TODO: Navigate to product listing page
    // this.router.navigate([this.viewAllUrl()]);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section']) {
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    const companyId = this.contextService.getCompanyId();

    // Look for a categoryId in section content (e.g., first child content entry)
    let categoryId: number | undefined;
    try {
      const content = this.section?.container?.children?.[0]?.content || [];
      const entry = Array.isArray(content) ? content.find((c: any) => c.categoryId || c.category_id || c.value) : null;
      const raw = entry?.categoryId || entry?.category_id || entry?.value;
      if (raw !== undefined && raw !== null && raw !== '') {
        const parsed = parseInt(String(raw), 10);
        if (!isNaN(parsed)) categoryId = parsed;
      }
    } catch {}

  this._loading.set(true);
  this._error.set(null);

    const obs = categoryId
      ? this.productService.getProductsByCategory(companyId, categoryId)
      : this.productService.getFeaturedProducts(companyId);

  obs.subscribe({
      next: (prods: any[]) => {
        // Normalize a bit for template compatibility
        const mapped = (prods || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.sale_price ?? p.price,
          originalPrice: p.sale_price ? p.price : undefined,
          image: p.image || (Array.isArray(p.images) ? p.images[0] : undefined),
          category: p.category_id,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          discount: p.sale_price ? Math.round(((p.price - p.sale_price) / p.price) * 100) : undefined,
          isNew: !!p.is_new
        }));
  this.productsSignal.set(mapped);
  this._loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
  this._error.set('Could not load products.');
  this._loading.set(false);
      }
    });
  }
}
