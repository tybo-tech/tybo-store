import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../models';

@Component({
  selector: 'app-category-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-showcase p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-tags text-teal-500 mr-3"></i>
          Featured Categories
        </h1>
        <p class="text-gray-600">Discover our premium sports and streetwear collections</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-teal-500 mb-4"></i>
            <p class="text-gray-600">Loading categories...</p>
          </div>
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            <div>
              <h3 class="text-red-800 font-medium">Error Loading Categories</h3>
              <p class="text-red-600 text-sm">{{ error() }}</p>
            </div>
          </div>
        </div>
      }

      @if (featuredCategories().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (category of featuredCategories(); track category.id) {
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div class="relative">
                @if (category.image_url) {
                  <img
                    [src]="category.image_url"
                    [alt]="category.name"
                    class="w-full h-48 object-cover"
                    loading="lazy"
                  />
                } @else {
                  <div class="w-full h-48 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <i class="fas fa-image text-white text-4xl opacity-50"></i>
                  </div>
                }
                @if (category.featured) {
                  <div class="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    <i class="fas fa-star mr-1"></i>
                    Featured
                  </div>
                }
              </div>

              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ category.name }}</h3>
                @if (category.description) {
                  <p class="text-gray-600 text-sm leading-relaxed mb-4">{{ category.description }}</p>
                }

                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <span>{{ formatDate(category.created_at) }}</span>
                  </div>
                  <button class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <i class="fas fa-arrow-right mr-2"></i>
                    Explore
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (!loading() && !error() && featuredCategories().length === 0) {
        <div class="text-center py-12">
          <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-600 mb-2">No Categories Found</h3>
          <p class="text-gray-500">No featured categories are available at the moment.</p>
        </div>
      }

      <!-- Quick Stats -->
      <div class="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-bar text-teal-500 mr-2"></i>
          Quick Stats
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-teal-600">{{ featuredCategories().length }}</div>
            <div class="text-sm text-gray-600">Featured Categories</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalCategories() }}</div>
            <div class="text-sm text-gray-600">Total Categories</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ rootCategories().length }}</div>
            <div class="text-sm text-gray-600">Root Categories</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-showcase {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
  `]
})
export class CategoryShowcaseComponent implements OnInit {
  private categoryService = inject(CategoryService);

  // Signals for reactive state management
  featuredCategories = signal<Category[]>([]);
  allCategories = signal<Category[]>([]);
  rootCategories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed values
  totalCategories = computed(() => this.allCategories().length);

  ngOnInit(): void {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Load featured categories
      this.categoryService.getFeaturedCategories().subscribe({
        next: (categories) => {
          this.featuredCategories.set(categories);
        },
        error: (err) => {
          console.error('Error loading featured categories:', err);
          this.error.set('Failed to load featured categories');
        }
      });

      // Load all categories
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.allCategories.set(categories);
        },
        error: (err) => {
          console.error('Error loading all categories:', err);
        }
      });

      // Load root categories
      this.categoryService.getRootCategories().subscribe({
        next: (categories) => {
          this.rootCategories.set(categories);
        },
        error: (err) => {
          console.error('Error loading root categories:', err);
        }
      });

    } catch (err) {
      console.error('Unexpected error:', err);
      this.error.set('An unexpected error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }
}
