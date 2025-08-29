import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSection } from '../../../models/website.interface';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [ngStyle]="sectionStyles()">
      <div class="relative overflow-hidden h-64 md:h-96 lg:h-[500px]">
        <!-- Slider container -->
        <div class="relative h-full">
          @for (slide of slides(); track $index) {
            <div
              [class]="slideClass($index)"
              [ngStyle]="slideStyles(slide)">
              <!-- Slide background -->
              @if (slide.backgroundImage) {
                <div
                  class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  [style.background-image]="'url(' + slide.backgroundImage + ')'">
                </div>
              }

              <!-- Slide content -->
              <div class="relative z-10 h-full flex items-center justify-center">
                <div class="text-center px-4 max-w-4xl mx-auto">
                  @if (slide.title) {
                    <h1 [ngStyle]="slide.titleStyles" class="text-4xl md:text-6xl font-bold mb-4">
                      {{ slide.title }}
                    </h1>
                  }
                  @if (slide.subtitle) {
                    <p [ngStyle]="slide.subtitleStyles" class="text-lg md:text-xl mb-6">
                      {{ slide.subtitle }}
                    </p>
                  }
                  @if (slide.buttonText) {
                    <button
                      [ngStyle]="slide.buttonStyles"
                      class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {{ slide.buttonText }}
                    </button>
                  }
                </div>
              </div>

              <!-- Overlay -->
              @if (slide.overlay) {
                <div
                  class="absolute inset-0 z-5"
                  [style.background-color]="slide.overlay.color"
                  [style.opacity]="slide.overlay.opacity">
                </div>
              }
            </div>
          }
        </div>

        <!-- Navigation dots -->
        @if (slides().length > 1) {
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div class="flex space-x-2">
              @for (slide of slides(); track $index) {
                <button
                  (click)="setCurrentSlide($index)"
                  [class]="dotClass($index)"
                  class="w-3 h-3 rounded-full transition-colors">
                </button>
              }
            </div>
          </div>
        }

        <!-- Navigation arrows -->
        @if (slides().length > 1) {
          <button
            (click)="previousSlide()"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            (click)="nextSlide()"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        }
      </div>
    </section>
  `,
  styles: [`
    .slide-enter {
      opacity: 0;
      transform: translateX(100%);
    }

    .slide-active {
      opacity: 1;
      transform: translateX(0);
    }

    .slide-exit {
      opacity: 0;
      transform: translateX(-100%);
    }
  `]
})
export class HeroSliderComponent {
  @Input() section!: PageSection;

  currentSlideIndex = signal(0);
  autoplayInterval: any;

  slides = computed(() => {
    // Extract slide data from container children if available
    const container = this.section?.container;
    if (container?.children) {
      // Map from PageElement structure to slide data
      return container.children.map(child => ({
        title: child.children?.find(c => c.tag === 'h1')?.value || 'Welcome to Our Store',
        subtitle: child.children?.find(c => c.tag === 'p')?.value || 'Discover amazing products at great prices',
        buttonText: child.children?.find(c => c.tag === 'button')?.value || 'Shop Now',
        backgroundImage: child.children?.find(c => c.tag === 'img')?.value || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
        titleStyles: child.children?.find(c => c.tag === 'h1')?.styles?.pc || { color: '#ffffff' },
        subtitleStyles: child.children?.find(c => c.tag === 'p')?.styles?.pc || { color: '#ffffff' },
        buttonStyles: child.children?.find(c => c.tag === 'button')?.styles?.pc || {},
        overlay: { color: '#000000', opacity: 0.4 }
      }));
    }

    // Default slide if no data
    return [
      {
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products at great prices',
        buttonText: 'Shop Now',
        backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
        titleStyles: { color: '#ffffff' },
        subtitleStyles: { color: '#ffffff' },
        buttonStyles: {},
        overlay: { color: '#000000', opacity: 0.4 }
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

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  slideClass(index: number): string {
    const current = this.currentSlideIndex();
    if (index === current) {
      return 'absolute inset-0 transition-all duration-500 ease-in-out slide-active';
    }
    return 'absolute inset-0 transition-all duration-500 ease-in-out slide-exit opacity-0';
  }

  slideStyles(slide: any) {
    return {
      ...(slide.backgroundColor && { 'background-color': slide.backgroundColor })
    };
  }

  dotClass(index: number): string {
    const current = this.currentSlideIndex();
    return index === current
      ? 'bg-white'
      : 'bg-white/50 hover:bg-white/75';
  }

  setCurrentSlide(index: number) {
    this.currentSlideIndex.set(index);
    this.restartAutoplay();
  }

  nextSlide() {
    const slides = this.slides();
    const next = (this.currentSlideIndex() + 1) % slides.length;
    this.setCurrentSlide(next);
  }

  previousSlide() {
    const slides = this.slides();
    const prev = (this.currentSlideIndex() - 1 + slides.length) % slides.length;
    this.setCurrentSlide(prev);
  }

  startAutoplay() {
    const autoplayDelay = 5000; // Default 5 seconds
    if (this.slides().length > 1) {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, autoplayDelay);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
