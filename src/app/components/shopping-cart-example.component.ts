import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, CategoryService, UserService, OrderService } from '../services';
import { Product, Category, OrderItem, OrderCreateRequest } from '../models';

@Component({
  selector: 'app-shopping-cart-example',
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="shopping-example">
      <h1>Tybo Store - Shopping Example</h1>

      <!-- User Authentication -->
      <div class="auth-section">
        @if (!userService.authenticated()) {
          <div class="login-form">
            <h3>Login</h3>
            <input [(ngModel)]="loginCredentials.username" placeholder="Username" />
            <input [(ngModel)]="loginCredentials.password" type="password" placeholder="Password" />
            <button (click)="login()">Login</button>
          </div>
        } @else {
          <div class="user-info">
            <span>Welcome, {{ userService.user()?.username }}!</span>
            <button (click)="logout()">Logout</button>
          </div>
        }
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <h3>Categories</h3>
        <select [(ngModel)]="selectedCategoryId" (change)="filterByCategory()">
          <option value="0">All Categories</option>
          @for (category of categories(); track category.id) {
            <option [value]="category.id">{{ category.name }}</option>
          }
        </select>
      </div>

      <!-- Product Search -->
      <div class="search-section">
        <input
          [(ngModel)]="searchQuery"
          (input)="searchProducts()"
          placeholder="Search products..."
        />
      </div>

      <!-- Products -->
      <div class="products-section">
        <h3>Products</h3>
        @if (loading()) {
          <div class="loading">Loading products...</div>
        } @else {
          <div class="products-grid">
            @for (product of products(); track product.id) {
              <div class="product-card">
                <h4>{{ product.name }}</h4>
                <p>{{ product.description }}</p>
                <div class="price">{{ product.price | currency }}</div>
                <button (click)="addToCart(product)">Add to Cart</button>
              </div>
            }
          </div>
        }
      </div>

      <!-- Shopping Cart -->
      <div class="cart-section">
        <h3>Shopping Cart ({{ cartItemCount() }} items)</h3>
        @if (cartItems().length > 0) {
          <div class="cart-items">
            @for (item of cartItems(); track item.product_id) {
              <div class="cart-item">
                <span>{{ item.product_name }}</span>
                <span>Qty: {{ item.quantity }}</span>
                <span>{{ item.total_price | currency }}</span>
                <button (click)="removeFromCart(item.product_id)">Remove</button>
              </div>
            }
          </div>
          <div class="cart-total">
            <strong>Total: {{ cartTotal() | currency }}</strong>
          </div>
          @if (userService.authenticated()) {
            <button (click)="checkout()" class="checkout-btn">Checkout</button>
          } @else {
            <p>Please login to checkout</p>
          }
        } @else {
          <p>Your cart is empty</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .shopping-example {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .auth-section, .category-filter, .search-section, .cart-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .login-form input {
      margin-right: 10px;
      padding: 8px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .cart-total {
      margin-top: 15px;
      font-size: 18px;
    }

    .checkout-btn {
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      margin-top: 10px;
    }

    button {
      padding: 8px 16px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
    }

    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class ShoppingCartExampleComponent implements OnInit {
  // Inject services
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);

  // Signals for reactive state
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly cartItems = signal<OrderItem[]>([]);
  readonly loading = signal<boolean>(false);

  // Computed signals
  readonly cartItemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  readonly cartTotal = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.total_price || 0), 0)
  );

  // Component state
  selectedCategoryId = 0;
  searchQuery = '';
  loginCredentials = { username: '', password: '' };

  private readonly companyId = 1; // This would typically come from app config

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories(): void {
    this.categoryService.getCategoriesForCompany(this.companyId).subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts({ company_id: this.companyId }).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.set(false);
      }
    });
  }

  filterByCategory(): void {
    if (this.selectedCategoryId === 0) {
      this.loadProducts();
    } else {
      this.loading.set(true);
      this.productService.getProductsByCategory(this.companyId, this.selectedCategoryId).subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error filtering products:', err);
          this.loading.set(false);
        }
      });
    }
  }

  searchProducts(): void {
    if (this.searchQuery.length < 2) {
      this.loadProducts();
      return;
    }

    this.loading.set(true);
    this.productService.searchProducts({
      query: this.searchQuery,
      company_id: this.companyId
    }).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.loading.set(false);
      }
    });
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems().find(item => item.product_id === product.id);

    if (existingItem) {
      // Update quantity
      const updatedItems = this.cartItems().map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price }
          : item
      );
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.sale_price || product.price,
        total_price: product.sale_price || product.price
      };
      this.cartItems.set([...this.cartItems(), newItem]);
    }
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems().filter(item => item.product_id !== productId);
    this.cartItems.set(updatedItems);
  }

  login(): void {
    this.userService.authenticate(this.loginCredentials).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loginCredentials = { username: '', password: '' };
        } else {
          alert('Login failed: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed');
      }
    });
  }

  logout(): void {
    this.userService.logout();
    this.cartItems.set([]); // Clear cart on logout
  }

  checkout(): void {
    if (!this.userService.authenticated()) {
      alert('Please login to checkout');
      return;
    }

    if (this.cartItems().length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData: OrderCreateRequest = {
      customer_id: this.userService.user()?.id,
      customer_name: this.userService.user()?.username,
      customer_email: this.userService.user()?.email,
      items: this.cartItems(),
      notes: 'Order placed through Angular app'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Order placed successfully!');
          this.cartItems.set([]); // Clear cart
        } else {
          alert('Order failed: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Checkout error:', err);
        alert('Checkout failed');
      }
    });
  }
}
