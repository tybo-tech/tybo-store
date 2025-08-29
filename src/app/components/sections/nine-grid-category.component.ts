import { Component, Input, OnInit, OnChanges, SimpleChanges, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageSection } from '../../models/website.interface';
import { CategoryService } from '../../services/category.service';

export interface CategoryItem {
  id: number | string;
  name: string;
  image_url: string;
  slug?: string;
  description?: string;
  link?: string;
}

@Component({
  selector: 'app-nine-grid-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nine-grid-category.component.html',
})
export class NineGridCategoryComponent implements OnInit, OnChanges {
  private categoryService = inject(CategoryService);
  /** Section input (matches hero-slider-new pattern) */
  @Input() section!: PageSection;

  /** Card base row height; row-span-2 becomes exactly 2x this */
  @Input() baseRowHeightPx = 220;

  /** Optional CTA/brand color for label bar */
  @Input() accentColor = '#a38349';

  // Derive categories from section content
  categories = computed<CategoryItem[]>(() => {
    const content = this.section?.container?.children?.[0]?.content || [];
    // Normalize shape to CategoryItem
    return content.map((c: any) => ({
      id: c.id ?? c.slug ?? c.name,
      name: c.name,
      image_url: c.image_url ?? c.image ?? '',
      slug: c.slug,
      description: c.description,
      link: c.link,
    }));
  });

  // Fallback fetched categories (featured for current company)
  private fetched = signal<CategoryItem[]>([]);
  private loading = signal<boolean>(false);

  // Effective categories: prefer section content, else fetched featured
  effectiveCategories = computed<CategoryItem[]>(() => {
    const fromSection = this.categories();
    return fromSection && fromSection.length ? fromSection : this.fetched();
  });

  // Build grid container classes based on count
  containerClass = computed(() => {
  const n = this.effectiveCategories().length;
    let grid = 'grid gap-5';
    let sm = 'sm:grid-cols-2';
    let lg = 'lg:grid-cols-3';

    if (n === 3) {
      lg = 'lg:grid-cols-3';
    } else if (n === 4) {
      lg = 'lg:grid-cols-4';
    } else if (n === 5) {
      lg = 'lg:grid-cols-3';
    } else if (n === 6) {
      lg = 'lg:grid-cols-3';
    } else if (n === 7) {
      lg = 'lg:grid-cols-4';
    } else if (n === 8) {
      lg = 'lg:grid-cols-4';
    } else if (n >= 9) {
      lg = 'lg:grid-cols-3 xl:grid-cols-3';
    }

    return `${grid} ${sm} ${lg}`;
  });

  // Auto rows so spans are precise
  autoRowsStyle = computed(() => ({
    gridAutoRows: `${this.baseRowHeightPx}px`,
  }));

  // TrackBy
  trackCat = (_: number, c: CategoryItem) => c.id ?? c.slug ?? c.name;

  // Pretty spans by count (lg+ only)
  tileSpanClass(i: number): string {
  const n = this.effectiveCategories().length;
    let cls = '';

    if (n === 5 && i === 2) cls = 'lg:row-span-2';
    if (n === 7 && i === 0) cls = 'lg:col-span-2 lg:row-span-2';
    if (n === 8 && (i === 1 || i === 6)) cls = 'lg:col-span-2 lg:row-span-2';
    // 3,4,6,9 default to standard cells

    return cls;
  }

  // Link builder: explicit link > slug route > none
  linkFor(c: CategoryItem) {
    if (c.link) return c.link;
    if (c.slug) return ['/shop']; // adjust route if needed
    return null;
  }

  // Query params for slug
  queryFor(c: CategoryItem) {
    return c.slug ? { category: c.slug } : null;
  }

  // CSS-safe class names for storefront style manager
  private sanitizeId(id?: string) {
    return (id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
  }
  sectionClass = computed(() => `sec-${this.sanitizeId(this.section?.id)}`);
  containerClassName = computed(() => `cont-${this.sanitizeId(this.section?.container?.id)}`);

  ngOnInit(): void {
    this.ensureFeaturedLoaded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section']) {
      // If section becomes empty, (re)load featured
      this.ensureFeaturedLoaded();
    }
  }

  private ensureFeaturedLoaded(): void {
    // Only fetch if section has no content and we haven't fetched yet
    if ((this.categories().length ?? 0) > 0) return;
    if (this.fetched().length > 0) return;
    this.loading.set(true);
    this.categoryService.getFeaturedCategories().subscribe({
      next: (cats) => {
        const mapped: CategoryItem[] = (cats ?? []).map((c: any) => ({
          id: c.id ?? c.slug ?? c.name,
          name: c.name,
          image_url: c.image_url ?? c.image ?? '',
          slug: c.slug,
          description: c.description,
        }));
        this.fetched.set(mapped);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
