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

@Component({
  selector: 'app-dynamic-element',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Section components
    HeroSliderComponent,
    NineGridCategoryComponent,
    CategoryProductsCarouselComponent
  ],
  template: `
    <!-- Dynamic element rendering: Can render both simple HTML elements AND complex components -->
    @switch (getElementTag()) {

      <!-- Complex Section Components (when element is PageSection) -->
      @case ('hero-slider') {
        <app-hero-slider
          [section]="asPageSection()"
          [id]="element.id">
        </app-hero-slider>
      }
  <!-- 'feature-intro' variants are rendered generically by default case -->
      @case ('nine-grid-category') {
        <app-nine-grid-category
          [section]="asPageSection()"
          [id]="element.id">
        </app-nine-grid-category>
      }
      @case ('category-products') {
        <app-category-products-carousel
          [section]="asPageSection()">
        </app-category-products-carousel>
      }
      @case ('category-with-products') {
        <app-category-products-carousel
          [section]="asPageSection()">
        </app-category-products-carousel>
      }

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
    const baseClass = `el-${this.element.id?.replace('el-', '') || 'unknown'}`;
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
