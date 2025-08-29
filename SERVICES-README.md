# Tybo Store Angular Services

This document provides documentation for the Angular services that interface with the Tybo Store backend API.

## Overview

The services are built following Angular best practices using:
- Standalone components
- Angular signals for reactive state management
- HttpClient for API communication
- TypeScript interfaces for type safety
- Injectable services with `providedIn: 'root'`

## Services Available

### 1. BaseApiService
The foundation service that all other services extend. Provides common HTTP methods and error handling.

### 2. CategoryService
Manages product categories.

**Methods:**
- `getCategories(companyId: number)` - Get all categories for a company
- `getCategoryById(id: number)` - Get specific category
- `getFeaturedCategories()` - Get featured categories
- `getRootCategories()` - Get root categories
- `createCategory(category)` - Create new category
- `updateCategory(category)` - Update existing category
- `deleteCategory(id)` - Delete category

**Example Usage:**
```typescript
import { inject } from '@angular/core';
import { CategoryService } from './services';

export class MyComponent {
  private categoryService = inject(CategoryService);
  
  loadCategories() {
    this.categoryService.getCategories(1).subscribe(categories => {
      console.log('Categories:', categories);
    });
  }
}
```

### 3. ProductService
Manages products with full CRUD operations and search functionality.

**Methods:**
- `getProducts(filter)` - Get products with filtering
- `getProductById(id)` - Get specific product
- `searchProducts(params)` - Search products
- `getFeaturedProducts(companyId)` - Get featured products
- `getSaleProducts(companyId)` - Get products on sale
- `getProductsByCategory(companyId, categoryId)` - Get products by category
- `createProduct(product)` - Create new product
- `updateProduct(product)` - Update existing product
- `deleteProduct(id)` - Delete product

**Example Usage:**
```typescript
import { signal } from '@angular/core';
import { ProductService } from './services';

export class ProductComponent {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  
  loadFeaturedProducts() {
    this.productService.getFeaturedProducts(1).subscribe(products => {
      this.products.set(products);
    });
  }
  
  searchProducts(query: string) {
    this.productService.searchProducts({ query, company_id: 1 }).subscribe(products => {
      this.products.set(products);
    });
  }
}
```

### 4. UserService (Authentication)
Manages user authentication and user data with signal-based state management.

**Properties:**
- `user()` - Signal containing current user (readonly)
- `authenticated()` - Signal indicating authentication status (readonly)

**Methods:**
- `authenticate(credentials)` - Login user
- `logout()` - Logout user
- `getUsers()` - Get all users
- `getUserById(id)` - Get specific user
- `createUser(user)` - Create new user
- `updateUser(user)` - Update existing user
- `updatePassword(passwordData)` - Update user password
- `isLoggedIn()` - Check if user is logged in

**Example Usage:**
```typescript
import { UserService } from './services';

export class AuthComponent {
  userService = inject(UserService);
  
  login(username: string, password: string) {
    this.userService.authenticate({ username, password }).subscribe(response => {
      if (response.status === 'success') {
        console.log('Logged in as:', this.userService.user()?.username);
      }
    });
  }
  
  logout() {
    this.userService.logout();
  }
}
```

### 5. OrderService
Manages customer orders.

**Methods:**
- `getOrders()` - Get all orders
- `getOrderById(id)` - Get specific order
- `getOrdersByCustomerId(customerId)` - Get orders by customer
- `createOrder(orderData)` - Create new order
- `updateOrder(order)` - Update existing order
- `updateOrderStatus(orderId, status)` - Update order status
- `cancelOrder(orderId)` - Cancel an order

### 6. VariationService
Manages product variations and their options.

**Methods:**
- `getVariations(companyId)` - Get all variations
- `getVariationById(id)` - Get specific variation
- `createVariation(variation)` - Create new variation
- `getVariationOptions()` - Get variation options
- `createVariationOption(option)` - Create variation option
- `getItemVariations()` - Get item variations

### 7. Additional Services
- **CompanyService** - Manage companies
- **CollectionDataService** - Manage collection data
- **UploadService** - Handle file uploads
- **EmailService** - Send emails

## Configuration

The API base URL is configured in a centralized endpoint file. Update it in `src/app/services/endpoint.ts`:

```typescript
// endpoint.ts
export const ApiBase = 'https://store.tybo.co.za/api.v3/api'; // Production
// export const ApiBase = 'http://localhost/api-tybo-store/api'; // Development
```

All services automatically use this configuration through the `BaseApiService` class. This makes it easy to switch between development and production environments by changing just one line.

## Error Handling

All services include built-in error handling. Errors are logged to the console and propagated for custom handling:

```typescript
this.productService.getProducts({ company_id: 1 }).subscribe({
  next: (products) => {
    // Handle success
  },
  error: (error) => {
    // Handle error
    console.error('Error loading products:', error);
  }
});
```

## Type Safety

All services use TypeScript interfaces for type safety:

```typescript
import { Product, Category, User } from './models';

// Type-safe product creation
const newProduct: Partial<Product> = {
  name: 'New Product',
  price: 29.99,
  company_id: 1
};

this.productService.createProduct(newProduct).subscribe(response => {
  // response is typed as ApiResponse<Product>
});
```

## State Management with Signals

The services use Angular signals for reactive state management:

```typescript
// In a component
export class MyComponent {
  private userService = inject(UserService);
  
  // These are reactive and will update the UI automatically
  isLoggedIn = computed(() => this.userService.authenticated());
  userName = computed(() => this.userService.user()?.username ?? 'Guest');
}
```

## Next Steps

1. Update the base API URL in `BaseApiService`
2. Configure CORS settings on your backend
3. Add authentication interceptors if needed
4. Create components that use these services
5. Add routing and navigation
6. Implement proper error handling and loading states

## Backend Endpoints Mapped

The services map to these backend endpoints:

### Categories
- GET `/categories/list.php?company_id=X`
- GET `/categories/get.php?id=X`
- GET `/categories/featured.php`
- GET `/categories/root.php`

### Products
- GET `/products/list.php?company_id=X&featured=X&on_sale=X&category_id=X`
- GET `/products/get.php?id=X`
- POST `/products/add.php`
- PUT `/products/update.php`
- GET `/products/search.php?query=X&company_id=X`

### Users
- POST `/users/authenticate.php`
- GET `/users/list.php`
- GET `/users/get.php?id=X`
- POST `/users/save.php`
- PUT `/users/update-password.php`

### Orders
- GET `/orders/list.php`
- GET `/orders/get.php?id=X`
- POST `/orders/add.php`
- PUT `/orders/update.php`

And many more endpoints as documented in the API analysis.
