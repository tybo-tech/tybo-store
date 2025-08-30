import { Component, input, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SlideContent {
  link: string;
  image: string;
  title: string;
  button: string;
  subtitle: string;
}

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="category-slider-container relative overflow-hidden"
      [style]="containerStyles()">

      <!-- Slides -->
      <div class="slides-wrapper relative w-full h-full">
        @for (slide of content(); track slide.link; let i = $index) {
          <div
            class="slide absolute inset-0 transition-opacity duration-500 ease-in-out"
            [class.opacity-100]="currentSlide() === i"
            [class.opacity-0]="currentSlide() !== i">

            <!-- Background Image -->
            <div
              class="slide-background absolute inset-0 bg-cover bg-center bg-no-repeat"
              [style.background-image]="'url(' + slide.image + ')'">
              <!-- Enhanced overlay for better text readability -->
              <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <!-- Additional center overlay for content area -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-full max-w-4xl mx-auto px-6">
                  <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 text-center">
                    <!-- Content -->
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                      {{ slide.title }}
                    </h2>
                    <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                      {{ slide.subtitle }}
                    </p>
                    <a
                      [routerLink]="slide.link"
                      class="inline-flex items-center px-8 py-4 theme-button font-semibold rounded-full
                             transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1
                             text-lg">
                      {{ slide.button }}
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Enhanced Navigation Dots -->
      @if (content().length > 1) {
        <div class="dots-container absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div class="flex space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            @for (slide of content(); track slide.link; let i = $index) {
              <button
                (click)="goToSlide(i)"
                class="w-3 h-3 rounded-full transition-all duration-300 border-2 border-white/60 hover:border-white"
                [class.bg-white]="currentSlide() === i"
                [class.bg-transparent]="currentSlide() !== i"
                [class.scale-125]="currentSlide() === i"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
              </button>
            }
          </div>
        </div>
      }

      <!-- Enhanced Navigation Arrows -->
      @if (content().length > 1) {
        <!-- Previous Arrow -->
        <button
          (click)="previousSlide()"
          class="nav-arrow absolute left-6 top-1/2 transform -translate-y-1/2 z-30
                 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md
                 rounded-full flex items-center justify-center transition-all duration-300
                 text-white hover:scale-110 border border-white/20 hover:border-white/40"
          aria-label="Previous slide">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Next Arrow -->
        <button
          (click)="nextSlide()"
          class="nav-arrow absolute right-6 top-1/2 transform -translate-y-1/2 z-30
                 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md
                 rounded-full flex items-center justify-center transition-all duration-300
                 text-white hover:scale-110 border border-white/20 hover:border-white/40"
          aria-label="Next slide">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      }

      <!-- Enhanced Play/Pause Button -->
      @if (content().length > 1) {
        <button
          (click)="toggleAutoPlay()"
          class="play-pause-button absolute top-6 right-6 z-30
                 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md
                 rounded-full flex items-center justify-center transition-all duration-300
                 text-white hover:scale-110 border border-white/20 hover:border-white/40"
          [attr.aria-label]="isAutoPlaying() ? 'Pause slideshow' : 'Play slideshow'">
          @if (isAutoPlaying()) {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path>
            </svg>
          } @else {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          }
        </button>
      }
    </div>
  `,
  styles: [`
    .category-slider-container {
      min-height: 360px;
    }

    @media (min-width: 768px) {
      .category-slider-container {
        min-height: 400px;
      }
    }

    @media (min-width: 1024px) {
      .category-slider-container {
        min-height: 480px;
      }
    }

    .theme-button {
      background-color: var(--color-primary, #ffffff);
      color: var(--color-primary-inverse, #000000);
      transition: all 0.2s ease;
    }

    .theme-button:hover {
      background-color: var(--color-primary-dark, #f0f0f0);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .slide {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .nav-arrow:hover {
      transform: translateY(-50%) scale(1.1);
    }

    .play-pause-button:hover {
      transform: scale(1.1);
    }

    .dots-container button:hover {
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .slide-content h2 {
        font-size: 2rem;
      }

      .slide-content p {
        font-size: 1rem;
      }

      .nav-arrow {
        width: 2.5rem;
        height: 2.5rem;
      }

      .nav-arrow svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .play-pause-button {
        width: 2rem;
        height: 2rem;
        top: 1rem;
        right: 1rem;
      }

      .play-pause-button svg {
        width: 1rem;
        height: 1rem;
      }

      .dots-container {
        bottom: 1rem;
      }

      .dots-container button {
        width: 0.5rem;
        height: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .slide-content h2 {
        font-size: 1.5rem;
      }

      .slide-content p {
        font-size: 0.875rem;
      }

      .slide-content {
        padding: 1rem;
      }

      .nav-arrow {
        width: 2rem;
        height: 2rem;
      }

      .nav-arrow svg {
        width: 1rem;
        height: 1rem;
      }
    }
  `]
})
export class CategorySliderComponent implements OnInit, OnDestroy {
  // Inputs
  content = input<SlideContent[]>([]);
  styles = input<any>({});
  autoPlay = input<boolean>(true);
  autoPlayInterval = input<number>(5000);

  // State
  protected _currentSlide = signal<number>(0);
  protected _isAutoPlaying = signal<boolean>(true);
  private intervalId: number | null = null;

  // Getters for template
  protected currentSlide() { return this._currentSlide(); }
  protected isAutoPlaying() { return this._isAutoPlaying(); }

  // Computed
  containerStyles = computed(() => {
    const baseStyles = this.styles();
    const pcStyles = baseStyles?.pc || {};
    const mobileStyles = baseStyles?.mobile || {};
    const tabletStyles = baseStyles?.tablet || {};

    return {
      width: pcStyles.width || '100%',
      height: pcStyles.height || '480px',
      padding: pcStyles.padding || '0',
      margin: pcStyles.margin || '0',
      backgroundColor: pcStyles['background-color'] || '#ffffff',
      ...pcStyles
    };
  });

  constructor() {
    // Watch for autoPlay changes
    effect(() => {
      if (this.autoPlay()) {
        this.startAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    });
  }

  ngOnInit() {
    if (this.autoPlay() && this.content().length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  goToSlide(index: number) {
    this._currentSlide.set(index);
    this.resetAutoPlay();
  }

  nextSlide() {
    const nextIndex = (this._currentSlide() + 1) % this.content().length;
    this._currentSlide.set(nextIndex);
    this.resetAutoPlay();
  }

  previousSlide() {
    const prevIndex = this._currentSlide() === 0
      ? this.content().length - 1
      : this._currentSlide() - 1;
    this._currentSlide.set(prevIndex);
    this.resetAutoPlay();
  }

  toggleAutoPlay() {
    if (this._isAutoPlaying()) {
      this.stopAutoPlay();
      this._isAutoPlaying.set(false);
    } else {
      this.startAutoPlay();
      this._isAutoPlaying.set(true);
    }
  }

  private startAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.content().length > 1) {
      this.intervalId = window.setInterval(() => {
        this.nextSlide();
      }, this.autoPlayInterval());
    }
  }

  private stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private resetAutoPlay() {
    if (this._isAutoPlaying()) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
}
