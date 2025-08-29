import { Component, Input, computed, signal, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageSection, HeroSliderContent } from '../../models/website.interface';

export interface HeroSlide {
  link?: string;
  image: string;
  title?: string;
  description?: string;
  alt?: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-slider.component.html'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  /** Core section data from parent */
  @Input() section!: PageSection;

  /** Responsive heights in pixels */
  @Input() height = 600;
  @Input() tabletHeight = 400;
  @Input() mobileHeight = 300;

  /** Behavior settings */
  @Input() autoPlay = true;
  @Input() intervalMs = 5000;
  @Input() loop = true;
  @Input() showOverlay = true;
  @Input() showIndicators = true;
  @Input() showArrows = true;
  @Input() showSlideCounter = false;
  @Input() enableKenBurnsEffect = true;

  /** UI customization */
  @Input() ctaTextOverride = '';

  // Internal state
  private currentSlideIndex = signal(0);
  private isTransitioningSignal = signal(false);
  private isLoadingSignal = signal(true);
  private autoPlayEnabledSignal = signal(true);
  private hovering = false;
  private timer: any;

  // Touch support
  private touchStartX = 0;
  private touchStartY = 0;
  private touchActive = false;

  // Computed properties
  slides = computed<HeroSlide[]>(() => {
    const content = this.section?.container?.children?.[0]?.content || [];
    return content.map((item: HeroSliderContent) => ({
      link: item.link,
      image: item.image,
      title: item.title,
      description: item.description,
      alt: item.title // Use title as alt if no specific alt text
    }));
  });

  currentSlide = computed(() => this.currentSlideIndex());
  isTransitioning = computed(() => this.isTransitioningSignal());
  isLoading = computed(() => this.isLoadingSignal());
  autoPlayEnabled = computed(() => this.autoPlayEnabledSignal() && this.autoPlay);

  containerHeight = computed(() => {
    if (typeof window === 'undefined') return this.height;
    const width = window.innerWidth;
    if (width >= 1024) return this.height;
    if (width >= 640) return this.tabletHeight;
    return this.mobileHeight;
  });

  ctaText = computed(() => {
    return this.ctaTextOverride || 'Explore';
  });

  enableKenBurns = computed(() => this.enableKenBurnsEffect);
  showOverlayComputed = computed(() => this.showOverlay);
  showIndicatorsComputed = computed(() => this.showIndicators);
  showArrowsComputed = computed(() => this.showArrows);
  autoPlayInterval = computed(() => this.intervalMs);

  ngOnInit(): void {
    // Initialize autoplay if enabled and we have multiple slides
    if (this.autoPlay && this.slides().length > 1) {
      this.autoPlayEnabledSignal.set(true);
      this.start();
    }

    // Preload images
    this.preloadImages();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private start(): void {
    this.stop();
    this.timer = setInterval(() => {
      if (!this.hovering && this.autoPlayEnabled()) {
        this.nextSlide();
      }
    }, this.intervalMs);
  }

  private stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  pauseAutoPlay(): void {
    this.hovering = true;
  }

  resumeAutoPlay(): void {
    this.hovering = false;
  }

  toggleAutoPlay(): void {
    const newState = !this.autoPlayEnabledSignal();
    this.autoPlayEnabledSignal.set(newState);

    if (newState && this.slides().length > 1) {
      this.start();
    } else {
      this.stop();
    }
  }

  nextSlide(): void {
    if (!this.slides().length || this.isTransitioning()) return;

    const lastIndex = this.slides().length - 1;
    const nextIndex = this.currentSlide() === lastIndex ?
      (this.loop ? 0 : lastIndex) :
      this.currentSlide() + 1;

    this.goToSlide(nextIndex);
  }

  previousSlide(): void {
    if (!this.slides().length || this.isTransitioning()) return;

    const lastIndex = this.slides().length - 1;
    const prevIndex = this.currentSlide() === 0 ?
      (this.loop ? lastIndex : 0) :
      this.currentSlide() - 1;

    this.goToSlide(prevIndex);
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides().length ||
        index === this.currentSlide() || this.isTransitioning()) {
      return;
    }

    this.isTransitioningSignal.set(true);
    this.currentSlideIndex.set(index);

    // Reset transition state after animation
    setTimeout(() => {
      this.isTransitioningSignal.set(false);
    }, 500);

    this.preloadNeighbors();
  }

  private preloadImages(): void {
    const slides = this.slides();
    if (!slides.length) return;

    this.isLoadingSignal.set(true);
    let loadedCount = 0;
    const totalImages = slides.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        this.isLoadingSignal.set(false);
      }
    };

    slides.forEach(slide => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
      img.src = slide.image;
    });
  }

  private preloadNeighbors(): void {
    const slides = this.slides();
    if (!slides.length) return;

    const nextIndex = (this.currentSlide() + 1) % slides.length;
    const prevIndex = (this.currentSlide() - 1 + slides.length) % slides.length;

    [slides[nextIndex]?.image, slides[prevIndex]?.image]
      .filter(Boolean)
      .forEach(src => {
        const img = new Image();
        img.src = src!;
      });
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        this.nextSlide();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.previousSlide();
        event.preventDefault();
        break;
      case ' ': // Space bar
        this.toggleAutoPlay();
        event.preventDefault();
        break;
      case 'Home':
        this.goToSlide(0);
        event.preventDefault();
        break;
      case 'End':
        this.goToSlide(this.slides().length - 1);
        event.preventDefault();
        break;
    }
  }

  // Touch/Swipe Support
  onTouchStart(event: TouchEvent): void {
    if (!event.touches.length) return;

    this.touchActive = true;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;

    // Pause autoplay during touch interaction
    this.pauseAutoPlay();
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.touchActive) return;

    this.touchActive = false;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // Minimum swipe distance and ensure horizontal swipe
    const minSwipeDistance = 50;
    const maxVerticalDistance = 100;

    if (Math.abs(deltaX) < minSwipeDistance ||
        Math.abs(deltaY) > maxVerticalDistance) {
      this.resumeAutoPlay();
      return;
    }

    // Determine swipe direction
    if (deltaX > 0) {
      this.previousSlide();
    } else {
      this.nextSlide();
    }

    // Resume autoplay after swipe
    setTimeout(() => this.resumeAutoPlay(), 100);
  }

  // Handle visibility changes (tab switching)
  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden) {
      this.stop();
    } else if (this.autoPlayEnabled()) {
      this.start();
    }
  }

  // Handle window resize for responsive heights
  @HostListener('window:resize')
  onWindowResize(): void {
    // Trigger height recalculation
    this.containerHeight();
  }

  // Utility methods for template
  slideAlt(index: number, slide: HeroSlide): string {
    return slide.alt || slide.title || `Slide ${index + 1}`;
  }

  previousSlideIndex(): number {
    const current = this.currentSlide();
    return current === 0 ? this.slides().length - 1 : current - 1;
  }

  nextSlideIndex(): number {
    const current = this.currentSlide();
    return current === this.slides().length - 1 ? 0 : current + 1;
  }
}
