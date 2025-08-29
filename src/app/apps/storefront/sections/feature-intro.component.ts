import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';

@Component({
  selector: 'app-feature-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [ngStyle]="sectionStyles()">
      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content Side -->
          <div [class]="contentOrder()">
            <div class="max-w-xl">
              @if (eyebrow()) {
                <span class="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                  {{ eyebrow() }}
                </span>
              }

              @if (title()) {
                <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                  {{ title() }}
                </h2>
              }

              @if (description()) {
                <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                  {{ description() }}
                </p>
              }

              @if (features().length > 0) {
                <ul class="space-y-4 mb-8">
                  @for (feature of features(); track $index) {
                    <li class="flex items-start">
                      <div class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span class="ml-3 text-gray-700">{{ feature }}</span>
                    </li>
                  }
                </ul>
              }

              @if (buttonText()) {
                <div class="flex flex-col sm:flex-row gap-4">
                  <button
                    (click)="onPrimaryButtonClick()"
                    class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    {{ buttonText() }}
                  </button>

                  @if (secondaryButtonText()) {
                    <button
                      (click)="onSecondaryButtonClick()"
                      class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      {{ secondaryButtonText() }}
                    </button>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Image Side -->
          <div [class]="imageOrder()">
            <div class="relative">
              <img
                [src]="image()"
                [alt]="title()"
                class="w-full h-auto rounded-lg shadow-xl">

              <!-- Decorative elements -->
              <div class="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 -z-10"></div>
              <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-100 rounded-full opacity-50 -z-10"></div>
            </div>
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

  eyebrow = computed(() => {
    const eyebrowElement = this.section?.container?.children?.find(child =>
      child.tag === 'span' || (child.tag === 'div' && child.children?.some(c => c.tag === 'span'))
    );
    return eyebrowElement?.value || eyebrowElement?.children?.find(c => c.tag === 'span')?.value || 'Why Choose Us';
  });

  title = computed(() => {
    const titleElement = this.section?.container?.children?.find(child => child.tag === 'h2');
    return titleElement?.value || 'Discover the Best Shopping Experience';
  });

  description = computed(() => {
    const descElement = this.section?.container?.children?.find(child => child.tag === 'p');
    return descElement?.value || 'We provide high-quality products, exceptional customer service, and unbeatable prices. Join thousands of satisfied customers who trust us for their shopping needs.';
  });

  features = computed(() => {
    const container = this.section?.container;
    if (container?.children) {
      const listElement = container.children.find(child => child.tag === 'ul');
      if (listElement?.children) {
        return listElement.children.map(li => li.value || '').filter(Boolean);
      }
    }

    // Default features
    return [
      'Free shipping on orders over $50',
      '30-day money-back guarantee',
      '24/7 customer support',
      'Secure payment processing'
    ];
  });

  buttonText = computed(() => {
    const buttonElement = this.section?.container?.children?.find(child => child.tag === 'button');
    return buttonElement?.value || 'Start Shopping';
  });

  secondaryButtonText = computed(() => {
    const buttons = this.section?.container?.children?.filter(child => child.tag === 'button') || [];
    return buttons[1]?.value || 'Learn More';
  });

  image = computed(() => {
    const imageElement = this.section?.container?.children?.find(child => child.tag === 'img');
    return imageElement?.value || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop';
  });

  imagePosition = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return styles['imagePosition'] as string || 'right';
  });

  contentOrder = computed(() => {
    return this.imagePosition() === 'left' ? 'order-2' : 'order-1';
  });

  imageOrder = computed(() => {
    return this.imagePosition() === 'left' ? 'order-1' : 'order-2';
  });

  sectionStyles = computed(() => {
    const styles = this.section?.styles?.pc || {};
    return {
      ...(styles['backgroundColor'] && { 'background-color': styles['backgroundColor'] }),
      ...(styles['padding'] && { padding: styles['padding'] }),
      ...(styles['margin'] && { margin: styles['margin'] })
    };
  });

  onPrimaryButtonClick() {
    console.log('Primary button clicked');
    // TODO: Handle primary action
    // this.router.navigate(['/shop']);
  }

  onSecondaryButtonClick() {
    console.log('Secondary button clicked');
    // TODO: Handle secondary action
    // this.router.navigate(['/about']);
  }
}
