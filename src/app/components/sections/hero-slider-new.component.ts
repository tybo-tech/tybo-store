import { Component, Input, computed, signal, OnInit, OnDestroy, HostListener, OnChanges, SimpleChanges } from '@angular/core';
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
export class HeroSliderComponent implements OnInit, OnDestroy, OnChanges {
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
  private timer: ReturnType<typeof setInterval> | null = null;

  // Reactive viewport width for responsive height calc
  private screenWidth = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

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
    const width = this.screenWidth();
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

  ngOnChanges(changes: SimpleChanges): void {
    // If slides source or autoplay toggled, reconcile autoplay and preload
    if (changes['section']) {
      this.currentSlideIndex.set(0);
      this.preloadImages();
    }
    if (changes['autoPlay']) {
      if (this.autoPlay && this.slides().length > 1) {
        this.autoPlayEnabledSignal.set(true);
        this.start();
      } else {
        this.stop();
      }
    }
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
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
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
  const slidesCount = this.slides().length;
  if (!slidesCount || this.isTransitioning()) return;

  const lastIndex = slidesCount - 1;
    const nextIndex = this.currentSlide() === lastIndex ?
      (this.loop ? 0 : lastIndex) :
      this.currentSlide() + 1;

    this.goToSlide(nextIndex);
  }

  previousSlide(): void {
  const slidesCount = this.slides().length;
  if (!slidesCount || this.isTransitioning()) return;

  const lastIndex = slidesCount - 1;
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

    // Load current and next first for fastest visual readiness
    this.isLoadingSignal.set(true);
    const currentIdx = this.currentSlide();
    const nextIdx = (currentIdx + 1) % slides.length;
    const priority = [slides[currentIdx]?.image, slides[nextIdx]?.image].filter(Boolean) as string[];

    let priorityLoaded = 0;
    const markReady = () => {
      priorityLoaded++;
      if (priorityLoaded >= Math.min(2, slides.length)) {
        this.isLoadingSignal.set(false);
      }
    };

    priority.forEach(src => {
      const img = new Image();
      img.onload = markReady;
      img.onerror = markReady;
      img.src = src;
    });

    // Background-load remaining images without affecting loading state
    slides.forEach((s, i) => {
      if (i === currentIdx || i === nextIdx) return;
      const img = new Image();
      img.src = s.image;
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
    // Update screen width to trigger reactive height recomputation
    if (typeof window !== 'undefined') {
      this.screenWidth.set(window.innerWidth);
    }
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
