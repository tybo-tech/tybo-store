/*
 * DYNAMIC ELEMENT COMPONENT - The Recursive Architecture
 *
 * This is the KEY component that implements the flexible architecture you described:
 *
 * 1. RECURSIVE RENDERING: This component calls itself to render nested elements
 * 2. HYBRID CAPABILITY: Can render both:
 *    - Simple HTML elements (h1, p, div, img, etc.)
 *    - Complex section components (hero-slider, feature-intro, etc.)
 *
 * 3. MAXIMUM FLEXIBILITY: You can now have:
 *    - A hero-slider INSIDE a div container
 *    - Simple text elements NEXT TO complex components
 *    - Flexbox/Grid layouts containing mixed content types
 *    - Product cards mixed with regular HTML elements
 *
 * 4. STYLING ARCHITECTURE:
 *    - Tailwind classes stored in database (className property)
 *    - Additional CSS properties for fine-tuning
 *    - Responsive design through device-specific styles
 *
 * Usage Example in JSON:
 * {
 *   "tag": "div",
 *   "styles": { "pc": { "className": "flex gap-4" } },
 *   "children": [
 *     { "tag": "hero-slider", ... },     // Complex component
 *     { "tag": "h2", "value": "Title" }, // Simple HTML element
 *     { "tag": "feature-intro", ... }    // Another complex component
 *   ]
 * }
 */

import { Component, Input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageElement } from '../models/website.interface';

// Import section components
import { FeatureIntroComponent } from '../apps/storefront/sections/feature-intro.component';
import { HeroSliderComponent } from '../apps/storefront/sections/hero-slider.component';
import { NineGridCategoryComponent } from '../apps/storefront/sections/nine-grid-category.component';
import { CategoryProductsComponent } from '../apps/storefront/sections/category-products.component';

@Component({
  selector: 'app-dynamic-element',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Section components - this is the key: DynamicElement can render complex components!
    FeatureIntroComponent,
    HeroSliderComponent,
    NineGridCategoryComponent,
    CategoryProductsComponent
  ],
  template: `
    <!-- The Dynamic Element is the RECURSIVE component that renders everything -->
    @switch (element.tag) {

      <!-- COMPLEX COMPONENTS: This is where the power comes from! -->
      <!-- DynamicElement can render both simple HTML AND complex section components -->
      @case ('hero-slider') {
        <app-hero-slider
          [section]="asSection()"
          [id]="element.id">
        </app-hero-slider>
      }
      @case ('feature-intro') {
        <app-feature-intro
          [section]="asSection()"
          [id]="element.id">
        </app-feature-intro>
      }
      @case ('nine-grid-category') {
        <app-nine-grid-category
          [section]="asSection()"
          [id]="element.id">
        </app-nine-grid-category>
      }
      @case ('category-products') {
        <app-category-products
          [section]="asSection()"
          [id]="element.id">
        </app-category-products>
      }

      <!-- SIMPLE HTML ELEMENTS: But it also handles basic HTML recursively -->
      @case ('div') {
        <div
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (element.children) {
            @for (child of element.children; track child.id) {
              <!-- RECURSION: Each child is also a dynamic element -->
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
          @if (element.children) {
            @for (child of element.children; track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          }
        </section>
      }
      @case ('h1') {
        <h1
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="element.value">
        </h1>
      }
      @case ('h2') {
        <h2
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="element.value">
        </h2>
      }
      @case ('h3') {
        <h3
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="element.value">
        </h3>
      }
      @case ('p') {
        <p
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [innerHTML]="element.value">
        </p>
      }
      @case ('span') {
        <span
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (element.children) {
            @for (child of element.children; track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          } @else {
            {{ element.value }}
          }
        </span>
      }
      @case ('button') {
        <button
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          type="button">
          {{ element.value }}
        </button>
      }
      @case ('a') {
        <a
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [href]="element.link || '#'">
          {{ element.value }}
        </a>
      }
      @case ('img') {
        <img
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()"
          [src]="element.value || element.link"
          [alt]="element.value || 'Image'">
      }
      @case ('ul') {
        <ul
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (element.children) {
            @for (child of element.children; track child.id) {
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

      <!-- DEFAULT: Treat unknown tags as containers -->
      @default {
        <div
          [id]="element.id"
          [class]="elementClasses()"
          [ngStyle]="elementStyles()">
          @if (element.children) {
            @for (child of element.children; track child.id) {
              <app-dynamic-element
                [element]="child"
                [device]="device">
              </app-dynamic-element>
            }
          } @else {
            {{ element.value || element.tag }}
          }
        </div>
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
  @Input() element!: PageElement;
  @Input() device: 'pc' | 'mobile' | 'tablet' = 'pc';

  /**
   * Convert PageElement to PageSection for section components
   */
  asSection(): any {
    return this.element as any;
  }

  /**
   * Get combined CSS classes: base element class + Tailwind classes from database
   * This is the hybrid approach: Tailwind + Database styles
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
   * These are the CSS properties that complement Tailwind classes
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
}
