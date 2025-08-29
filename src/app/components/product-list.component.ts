import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService, CategoryService } from '../services';
import { Product, Category } from '../models';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="product-list">
      <h2>Products</h2>

      <!-- Loading state -->
      @if (loading()) {
        <div class="loading">Loading products...</div>
      }

      <!-- Error state -->
      @if (error()) {
        <div class="error">Error: {{ error() }}</div>
      }

      <!-- Products grid -->
      @if (products().length > 0) {
        <div class="products-grid">
          @for (product of products(); track product.id) {
            <div class="product-card">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="price">
                @if (product.sale_price && product.sale_price < product.price) {
                  <span class="sale-price">{{product.sale_price | currency}}</span>
                  <span class="original-price">{{product.price | currency}}</span>
                } @else {
                  <span class="price">{{product.price | currency}}</span>
                }
              </div>
              @if (product.is_featured) {
                <span class="featured-badge">Featured</span>
              }
            </div>
          }
        </div>
      } @else if (!loading()) {
        <div class="no-products">No products found.</div>
      }
    </div>
  `,
  styles: [`
    .product-list {
      padding: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .product-card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .product-card p {
      color: #666;
      margin: 0 0 12px 0;
    }

    .price {
      font-weight: bold;
      color: #2c5aa0;
    }

    .sale-price {
      color: #e74c3c;
      font-weight: bold;
    }

    .original-price {
      text-decoration: line-through;
      color: #999;
      margin-left: 8px;
    }

    .featured-badge {
      background: #f39c12;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 8px;
      display: inline-block;
    }

    .loading, .error, .no-products {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error {
      color: #e74c3c;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  // Signals for reactive state
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    // Example: Load products for company ID 1
    const companyId = 1;

    this.productService.getProducts({ company_id: companyId }).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products');
        this.loading.set(false);
        console.error('Error loading products:', err);
      }
    });
  }

  // Method to load featured products
  loadFeaturedProducts(): void {
    const companyId = 1;
    this.productService.getFeaturedProducts(companyId).subscribe({
      next: (products) => this.products.set(products),
      error: (err) => this.error.set('Failed to load featured products')
    });
  }

  // Method to search products
  searchProducts(query: string): void {
    if (query.length < 2) return;

    const companyId = 1;
    this.productService.searchProducts({ query, company_id: companyId }).subscribe({
      next: (products) => this.products.set(products),
      error: (err) => this.error.set('Failed to search products')
    });
  }
}
