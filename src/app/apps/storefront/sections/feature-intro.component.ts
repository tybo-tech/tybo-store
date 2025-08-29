import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';

@Component({
  selector: 'app-feature-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [ngStyle]="sectionStyles()">
      <!-- This component now works standalone - no need for dynamic element inside -->
      <!-- The DynamicElementComponent will call this component when it sees tag="feature-intro" -->
      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content Side -->
          <div class="max-w-xl">
            <span class="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              Why Choose Us
            </span>

            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              Discover the Best Shopping Experience
            </h2>

            <p class="text-lg text-gray-600 mb-8 leading-relaxed">
              We provide high-quality products, exceptional customer service, and unbeatable prices.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Shopping
              </button>
              <button class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </div>

          <!-- Image Side -->
          <div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Feature Image"
              class="w-full h-auto rounded-lg shadow-xl">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .feature-intro {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `]
})
export class FeatureIntroComponent {
  @Input() section!: PageSection;

  /**
   * Get current device type for responsive rendering
   */
  currentDevice = computed(() => {
    // Simple responsive detection - you might want to use Angular CDK Breakpoints
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 768) return 'mobile';
      if (width <= 1024) return 'tablet';
    }
    return 'pc';
  });

  /**
   * Get section-level styles
   */
  sectionStyles = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return {
      ...(styles['backgroundColor'] && { 'background-color': styles['backgroundColor'] }),
      ...(styles['padding'] && { padding: styles['padding'] }),
      ...(styles['margin'] && { margin: styles['margin'] })
    };
  });
}
