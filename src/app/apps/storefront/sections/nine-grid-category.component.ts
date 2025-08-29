import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';

@Component({
  selector: 'app-nine-grid-category',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [ngStyle]="sectionStyles()">
      <div class="container mx-auto px-4 py-8">
        @if (sectionTitle()) {
          <h2 class="text-3xl font-bold text-center mb-8">{{ sectionTitle() }}</h2>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (category of categories(); track category.id) {
            <div
              class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white"
              (click)="onCategoryClick(category)">

              <!-- Category Image -->
              <div class="aspect-square overflow-hidden">
                <img
                  [src]="category.image || defaultImage"
                  [alt]="category.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy">
              </div>

              <!-- Category Info Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <div class="p-4 text-white w-full">
                  <h3 class="text-lg font-semibold mb-1">{{ category.name }}</h3>
                  @if (category.description) {
                    <p class="text-sm opacity-90">{{ category.description }}</p>
                  }
                  @if (category.productCount) {
                    <p class="text-xs opacity-75 mt-1">{{ category.productCount }} items</p>
                  }
                </div>
              </div>

              <!-- Hover Effect -->
              <div class="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Category Badge -->
              @if (category.featured) {
                <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </div>
              }
            </div>
          }
        </div>

        @if (showViewAllButton()) {
          <div class="text-center mt-8">
            <button
              (click)="onViewAllClick()"
              class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View All Categories
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .aspect-square {
      aspect-ratio: 1 / 1;
    }
  `]
})
export class NineGridCategoryComponent {
  @Input() section!: PageSection;

  defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';

  sectionTitle = computed(() => {
    const titleElement = this.section?.container?.children?.find(child => child.tag === 'h2');
    return titleElement?.value || 'Shop by Category';
  });

  categories = computed(() => {
    const container = this.section?.container;
    if (container?.children) {
      // Extract category data from container structure
      const categoryElements = container.children.filter(child => child.tag === 'div' && child.children);
      return categoryElements.map((element, index) => {
        const imageElement = element.children?.find(c => c.tag === 'img');
        const titleElement = element.children?.find(c => c.tag === 'h3');
        const descElement = element.children?.find(c => c.tag === 'p');

        return {
          id: element.id || `category-${index}`,
          name: titleElement?.value || `Category ${index + 1}`,
          description: descElement?.value || '',
          image: imageElement?.value || this.defaultImage,
          productCount: Math.floor(Math.random() * 50) + 10, // Mock data
          featured: index < 3 // Mark first 3 as featured
        };
      });
    }

    // Default categories if no data
    return [
      {
        id: 'electronics',
        name: 'Electronics',
        description: 'Latest gadgets and tech',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
        productCount: 45,
        featured: true
      },
      {
        id: 'clothing',
        name: 'Clothing',
        description: 'Fashion for everyone',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        productCount: 120,
        featured: true
      },
      {
        id: 'home',
        name: 'Home & Garden',
        description: 'Beautify your space',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        productCount: 78,
        featured: true
      },
      {
        id: 'sports',
        name: 'Sports',
        description: 'Gear for active life',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        productCount: 32,
        featured: false
      },
      {
        id: 'books',
        name: 'Books',
        description: 'Knowledge and entertainment',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        productCount: 156,
        featured: false
      },
      {
        id: 'beauty',
        name: 'Beauty',
        description: 'Look and feel great',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        productCount: 89,
        featured: false
      },
      {
        id: 'automotive',
        name: 'Automotive',
        description: 'Car care and accessories',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
        productCount: 67,
        featured: false
      },
      {
        id: 'toys',
        name: 'Toys & Games',
        description: 'Fun for all ages',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
        productCount: 43,
        featured: false
      },
      {
        id: 'food',
        name: 'Food & Beverages',
        description: 'Taste the difference',
        image: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400&h=400&fit=crop',
        productCount: 234,
        featured: false
      }
    ];
  });

  sectionStyles = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return {
      ...(styles['backgroundColor'] && { 'background-color': styles['backgroundColor'] }),
      ...(styles['padding'] && { padding: styles['padding'] }),
      ...(styles['margin'] && { margin: styles['margin'] })
    };
  });

  showViewAllButton = computed(() => {
    return this.categories().length > 9;
  });

  onCategoryClick(category: any) {
    console.log('Category clicked:', category);
    // TODO: Navigate to category page
    // this.router.navigate(['/shop', 'category', category.id]);
  }

  onViewAllClick() {
    console.log('View all categories clicked');
    // TODO: Navigate to all categories page
    // this.router.navigate(['/shop', 'categories']);
  }
}
