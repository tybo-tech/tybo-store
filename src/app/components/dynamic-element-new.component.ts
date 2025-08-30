// NOTE: Scope clarification
// This dynamic renderer is strictly for Company Pages and their Sections/Elements.
// It does not depend on or use any Website/WebsitePage models or services.
// Keep inputs and logic limited to PageSection and PageElement as used below.
// Scope: Company Pages only
// This renderer handles PageSection and PageElement for company pages (no website objects).
import { Component, Input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageElement, PageSection } from '../models/website.interface';

// Import section components
import { NineGridCategoryComponent } from './sections/nine-grid-category.component';
import { CategoryProductsCarouselComponent } from '../apps/storefront/sections/category-products-carousel.component';
import { HeroSliderComponent } from './sections/hero-slider-new.component';
import { CategorySliderComponent } from './sections/category-slider.component';

@Component({
  selector: 'app-dynamic-element',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Section components
    HeroSliderComponent,
    NineGridCategoryComponent,
    CategoryProductsCarouselComponent,
    CategorySliderComponent
  ],
  template: `
    <!-- Dynamic element rendering: Can render both simple HTML elements AND complex components -->
    @switch (getElementTag()) {

      <!-- Container Elements with Recursive Children -->
      @case ('div') {
        <div
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </div>
      }
      @case ('section') {
        <section
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </section>
      }
      @case ('article') {
        <article
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </article>
      }
      @case ('header') {
        <header
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </header>
      }
      @case ('footer') {
        <footer
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </footer>
      }
      @case ('nav') {
        <nav
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </nav>
      }
      @case ('main') {
        <main
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </main>
      }
      @case ('aside') {
        <aside
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </aside>
      }
      @case ('span') {
        <span
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          } @else {
            {{ getValue() }}
          }
        </span>
      }

      <!-- Text Content Elements -->
      @case ('h1') {
        <h1
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h1>
      }
      @case ('h2') {
        <h2
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h2>
      }
      @case ('h3') {
        <h3
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h3>
      }
      @case ('h4') {
        <h4
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h4>
      }
      @case ('h5') {
        <h5
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h5>
      }
      @case ('h6') {
        <h6
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </h6>
      }
      @case ('p') {
        <p
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="getValue()">
        </p>
      }

      <!-- Interactive Elements -->
      @case ('button') {
        <button
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          type="button">
          {{ getValue() }}
        </button>
      }
      @case ('a') {
        <a
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [href]="getHref()">
          {{ getValue() }}
        </a>
      }

      <!-- Media Elements -->
      @case ('img') {
        <img
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [src]="getSrc()"
          [alt]="getAlt()">
      }

      <!-- List Elements -->
      @case ('ul') {
        <ul
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <li>
                <app-dynamic-element
                  [element]="child"
                  [device]="device">
                </app-dynamic-element>
              </li>
            }
          }
        </ul>
      }
      @case ('ol') {
        <ol
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <li>
                <app-dynamic-element
                  [element]="child"
                  [device]="device">
                </app-dynamic-element>
              </li>
            }
          }
        </ol>
      }
      @case ('li') {
        <li
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          } @else {
            {{ getValue() }}
          }
        </li>
      }

      <!-- Form Elements -->
      @case ('form') {
        <form
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </form>
      }
      @case ('input') {
        <input
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [type]="'text'"
          [placeholder]="getPlaceholder()"
          [value]="getValue()">
      }
      @case ('textarea') {
        <textarea
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [placeholder]="getPlaceholder()">{{ getValue() }}</textarea>
      }
      @case ('select') {
        <select
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (getChildren().length) {
            @for (child of getChildren(); track child.id) {
              <option [value]="child.value">{{ child.value }}</option>
            }
          }
        </select>
      }

      <!-- Misc Elements -->
      @case ('hr') {
        <hr
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
      }
      @case ('br') {
        <br>
      }

      <!-- Special Components - treat them like any other leaf element -->
      @case ('category-slider') {
        <app-category-slider
          [content]="getCategorySliderContent()"

          [autoPlay]="true"
          [autoPlayInterval]="5000">
        </app-category-slider>
      }
      @case ('hero-slider') {
        <app-hero-slider
          [section]="asPageSection()"
          [id]="element.id">
        </app-hero-slider>
      }
      @case ('nine-grid-category') {
        <app-nine-grid-category
          [section]="asPageSection()"
          [id]="element.id">
        </app-nine-grid-category>
      }
      @case ('category-products') {
        <app-category-products-carousel
          [section]="createSectionFromElement()">
        </app-category-products-carousel>
      }
      @case ('category-with-products') {
        <app-category-products-carousel
          [section]="createSectionFromElement()">
        </app-category-products-carousel>
      }

      <!-- Default case for unknown elements -->
      @default {
        @if (isPageSection()) {
          <!-- Generic Section Rendering: section wrapper + container wrapper -->
          <section
            [id]="element.id"
            [class]="sectionWrapperClasses()"
            [ngStyle]="sectionWrapperStyles()">
            <div
              [class]="containerWrapperClasses()"
              [ngStyle]="containerWrapperStyles()">
              @if (getChildren().length) {
                @for (child of getChildren(); track child.id) {
                  <app-dynamic-element
                    [element]="child"
                    [device]="device">
                  </app-dynamic-element>
                }
              } @else {
                <div class="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded p-3">
                  Section '{{ getElementTag() }}' has no content yet.
                </div>
              }
            </div>
          </section>
        } @else {
          <!-- Generic Element Rendering -->
          <div
            [id]="element.id"
            [class]="elementClasses()"
            [ngStyle]="elementStyles()">
            @if (getChildren().length) {
              @for (child of getChildren(); track child.id) {
                <app-dynamic-element
                  [element]="child"
                  [device]="device">
                </app-dynamic-element>
              }
            } @else {
              {{ getValue() || getElementTag() }}
            }
          </div>
        }
      }
    }
  `,
  styles: [`
    /* Host styles to ensure proper display */
    :host {
      display: contents;
      border: none;
      outline: none;
    }

    /* Base element styles */
    .el-base {
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
    }

    /* Editor mode styles (for future use) */
    .editor-mode {
      transition: none !important;
      cursor: pointer;
      user-select: none;

      &:hover {
        border: 0.1px dotted #1abc9c52;
      }

      &.selected {
        border: 1px solid #1abc9c;
        box-shadow: 0 0 10px #1abc9ca9;
      }
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class DynamicElementComponent {
  @Input() element!: PageElement | PageSection;
  @Input() device: 'pc' | 'mobile' | 'tablet' = 'pc';

  /**
   * Type guard to check if element is a PageSection
   */
  isPageSection(): boolean {
    return 'type' in this.element && 'container' in this.element;
  }

  /**
   * Cast element to PageSection when needed
   */
  asPageSection(): PageSection {
    return this.element as PageSection;
  }

  /**
   * Cast element to PageElement when needed
   */
  asPageElement(): PageElement {
    return this.element as PageElement;
  }

  /**
   * Get the tag for switching - use 'type' for sections, 'tag' for elements
   */
  getElementTag(): string {
    return this.isPageSection()
      ? (this.element as PageSection).type
      : (this.element as PageElement).tag;
  }

  /**
   * Get combined CSS classes: base element class + Tailwind classes from database
   */
  elementClasses = computed(() => {
    const elementId = this.element.id || 'unknown';
    const cleanId = elementId.replace(/^el-/, ''); // Remove el- prefix if present
    const baseClass = `el-${this.sanitizeId(cleanId)}`;
    const deviceStyles = this.element.styles?.[this.device] || {};

    // Extract Tailwind classes from database styles
    // These would be stored as space-separated class names
    const tailwindClasses = deviceStyles['className'] || '';

    return `el-base ${baseClass} ${tailwindClasses}`.trim();
  });

  /**
   * Get inline styles from database (complementary to Tailwind)
   */
  elementStyles = computed(() => {
    const deviceStyles = this.element.styles?.[this.device] || {};
    const inlineStyles: any = {};

    // Filter out className and other non-CSS properties
    Object.keys(deviceStyles).forEach(key => {
      if (key !== 'className' && typeof deviceStyles[key] === 'string') {
        // Convert camelCase to kebab-case for CSS
        const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        inlineStyles[cssProperty] = deviceStyles[key];
      }
    });

    return inlineStyles;
  });

  /**
   * Get element value safely
   */
  getValue(): string {
    if (this.isPageSection()) return '';
    return (this.element as PageElement).value || '';
  }

  /**
   * Get element children safely
   */
  getChildren(): PageElement[] {
    if (this.isPageSection()) {
      return (this.element as PageSection).container?.children || [];
    }
    return (this.element as PageElement).children || [];
  }

  /**
   * Get element link safely
   */
  getLink(): string {
    if (this.isPageSection()) return '';
    return (this.element as PageElement).link || '';
  }

  /**
   * Get element placeholder safely
   */
  getPlaceholder(): string {
    if (this.isPageSection()) return '';
    return (this.element as PageElement).placeholder || '';
  }

  /**
   * Get element src safely
   */
  getSrc(): string {
    if (this.isPageSection()) return '';
    return (this.element as PageElement).src || this.getValue();
  }

  /**
   * Get element href safely
   */
  getHref(): string {
    if (this.isPageSection()) return '#';
    return (this.element as PageElement).href || this.getLink() || '#';
  }

  /**
   * Get element alt safely
   */
  getAlt(): string {
    if (this.isPageSection()) return 'Image';
    return (this.element as PageElement).alt || 'Image';
  }

  /**
   * Extract category slider content from element
   */
  getCategorySliderContent(): any[] {
    if (this.isPageSection()) return this.getDefaultSliderContent();

    const element = this.asPageElement();
    const content = element.content || [];

    // If we have proper content, use it
    if (content.length > 0 && content[0].title) {
      return content;
    }

    // Otherwise, provide default content for demo/testing
    return this.getDefaultSliderContent();
  }

  /**
   * Get default slider content for demonstration
   */
  private getDefaultSliderContent(): any[] {
    return [
      {
        link: '/shop/workwear',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
        title: 'Professional Workwear',
        button: 'Shop Workwear',
        subtitle: 'High-quality workwear for professionals. Durable, comfortable, and stylish clothing for every job.'
      },
      {
        link: '/shop/printing',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop',
        title: 'Printing Solutions',
        button: 'Explore Printing',
        subtitle: 'Advanced printing machines and solutions for all your business needs. Quality prints, every time.'
      },
      {
        link: '/shop/featured',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop',
        title: 'Featured Products',
        button: 'View Featured',
        subtitle: 'Discover our hand-picked selection of premium products. Quality, innovation, and style combined.'
      }
    ];
  }

  /**
   * Create a section object from an element for components that expect sections
   */
  createSectionFromElement(): PageSection {
    if (this.isPageSection()) {
      return this.asPageSection();
    }

    const element = this.asPageElement();
    // Create a mock section structure from element data
    // For category components, we need to preserve the element's content in the expected structure
    return {
      id: `section-from-${element.id}`,
      type: element.tag,
      pageId: 'dynamic',
      styles: element.styles || {},
      container: {
        id: `container-from-${element.id}`,
        tag: 'div',
        styles: {},
        children: [
          {
            ...element,
            // Ensure the content is available at the expected location
            content: element.content || []
          }
        ]
      }
    } as PageSection;
  }

  // -------- Generic PageSection rendering helpers --------
  private sanitizeId(id?: string): string {
    return (id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  private getDeviceStyles(obj?: any): any {
    if (!obj) return {};
    return obj[this.device] || {};
  }

  private extractTailwindClassName(styles: any): string {
    return typeof styles?.className === 'string' ? styles.className : '';
    }

  sectionWrapperClasses(): string {
    const section = this.asPageSection();
    const secCls = `sec-${this.sanitizeId(section.id)}`;
    const deviceStyles = this.getDeviceStyles(section.styles);
    const tailwind = this.extractTailwindClassName(deviceStyles);
    return [secCls, tailwind].filter(Boolean).join(' ').trim();
  }

  sectionWrapperStyles(): Record<string, string> {
    const section = this.asPageSection();
    const deviceStyles = { ...this.getDeviceStyles(section.styles) };
    delete deviceStyles.className;

    // Remove width-constraining properties that should be on container, not section
    delete deviceStyles['max-width'];
    delete deviceStyles['maxWidth'];
    delete deviceStyles['min-width'];
    delete deviceStyles['minWidth'];

    const inline: any = {};
    Object.keys(deviceStyles).forEach(k => {
      const cssKey = k.includes('-') ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
      inline[cssKey] = String(deviceStyles[k]);
    });
    return inline;
  }

  containerWrapperClasses(): string {
    const section = this.asPageSection();
    const contId = section.container?.id || '';
    const contCls = `cont-${this.sanitizeId(contId)}`;
    const deviceStyles = this.getDeviceStyles(section.container?.styles);
    const tailwind = this.extractTailwindClassName(deviceStyles);
    return [contCls, tailwind].filter(Boolean).join(' ').trim();
  }

  containerWrapperStyles(): Record<string, string> {
    const section = this.asPageSection();
    const deviceStyles = { ...this.getDeviceStyles(section.container?.styles) };
    delete deviceStyles.className;
    const inline: any = {};
    Object.keys(deviceStyles).forEach(k => {
      const cssKey = k.includes('-') ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
      inline[cssKey] = String(deviceStyles[k]);
    });
    return inline;
  }
}
