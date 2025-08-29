import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, ProductService, UserService, ApiBase } from '../services';

@Component({
  selector: 'app-api-test',
  imports: [CommonModule],
  template: `
    <div class="api-test">
      <h2>API Configuration Test</h2>

      <div class="api-info">
        <p><strong>API Base URL:</strong> {{ apiBase }}</p>
        <p><strong>Status:</strong> {{ status() }}</p>
      </div>

      <div class="test-section">
        <h3>Test Results</h3>

        @if (loading()) {
          <div class="loading">Testing API connections...</div>
        } @else {
          <div class="results">
            <div class="test-result" [class.success]="categoriesLoaded()" [class.error]="!categoriesLoaded()">
              Categories API: {{ categoriesLoaded() ? '✓ Working' : '✗ Failed' }}
            </div>
            <div class="test-result" [class.success]="productsLoaded()" [class.error]="!productsLoaded()">
              Products API: {{ productsLoaded() ? '✓ Working' : '✗ Failed' }}
            </div>
            <div class="test-result" [class.success]="usersLoaded()" [class.error]="!usersLoaded()">
              Users API: {{ usersLoaded() ? '✓ Working' : '✗ Failed' }}
            </div>
          </div>
        }

        @if (errors().length > 0) {
          <div class="errors">
            <h4>Errors:</h4>
            @for (error of errors(); track $index) {
              <div class="error">{{ error }}</div>
            }
          </div>
        }
      </div>

      <button (click)="testAPIs()" [disabled]="loading()">
        {{ loading() ? 'Testing...' : 'Test APIs' }}
      </button>
    </div>
  `,
  styles: [`
    .api-test {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    .api-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .api-info p {
      margin: 5px 0;
    }

    .test-section {
      margin: 20px 0;
    }

    .results {
      margin: 15px 0;
    }

    .test-result {
      padding: 8px 12px;
      margin: 5px 0;
      border-radius: 4px;
      font-weight: bold;
    }

    .test-result.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .test-result.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .errors {
      margin-top: 15px;
      padding: 15px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    .error {
      color: #721c24;
      margin: 5px 0;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
    }

    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly userService = inject(UserService);

  readonly apiBase = ApiBase;
  readonly loading = signal<boolean>(false);
  readonly status = signal<string>('Ready to test');
  readonly categoriesLoaded = signal<boolean>(false);
  readonly productsLoaded = signal<boolean>(false);
  readonly usersLoaded = signal<boolean>(false);
  readonly errors = signal<string[]>([]);

  ngOnInit(): void {
    this.status.set('Click "Test APIs" to verify connections');
  }

  testAPIs(): void {
    this.loading.set(true);
    this.status.set('Testing API connections...');
    this.errors.set([]);
    this.categoriesLoaded.set(false);
    this.productsLoaded.set(false);
    this.usersLoaded.set(false);

    // Test Categories API
    this.categoryService.getCategories(1).subscribe({
      next: (categories) => {
        this.categoriesLoaded.set(true);
        console.log('Categories loaded:', categories.length);
        this.checkAllComplete();
      },
      error: (err) => {
        this.errors.update(errors => [...errors, `Categories API: ${err.message || 'Failed to load'}`]);
        this.checkAllComplete();
      }
    });

    // Test Products API
    this.productService.getProducts({ company_id: 1 }).subscribe({
      next: (products) => {
        this.productsLoaded.set(true);
        console.log('Products loaded:', products.length);
        this.checkAllComplete();
      },
      error: (err) => {
        this.errors.update(errors => [...errors, `Products API: ${err.message || 'Failed to load'}`]);
        this.checkAllComplete();
      }
    });

    // Test Users API
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.usersLoaded.set(true);
        console.log('Users loaded:', users.length);
        this.checkAllComplete();
      },
      error: (err) => {
        this.errors.update(errors => [...errors, `Users API: ${err.message || 'Failed to load'}`]);
        this.checkAllComplete();
      }
    });
  }

  private checkAllComplete(): void {
    // Wait a bit to ensure all requests have completed
    setTimeout(() => {
      this.loading.set(false);
      const successCount = [this.categoriesLoaded(), this.productsLoaded(), this.usersLoaded()]
        .filter(Boolean).length;

      if (successCount === 3) {
        this.status.set('✅ All APIs working correctly!');
      } else if (successCount > 0) {
        this.status.set(`⚠️ ${successCount}/3 APIs working`);
      } else {
        this.status.set('❌ All API tests failed');
      }
    }, 1000);
  }
}
