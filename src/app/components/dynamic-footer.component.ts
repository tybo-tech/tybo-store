import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContextService, CompanyPage } from '../services/context.service';

@Component({
  selector: 'app-dynamic-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="dynamic-footer" [ngStyle]="footerStyles()">
      <div class="container mx-auto px-4 py-8">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <!-- Company Info -->
          <div class="footer-section">
            <div class="flex items-center mb-4">
              @if (company()?.logo) {
                <img
                  [src]="company()!.logo"
                  [alt]="company()!.name + ' Logo'"
                  class="footer-logo mr-3"
                  [ngStyle]="logoStyles()">
              }
              <h3 class="text-lg font-bold" [ngStyle]="headingStyles()">
                {{ company()?.name }}
              </h3>
            </div>
            @if (company()?.description) {
              <p class="text-sm mb-4" [ngStyle]="textStyles()">
                {{ company()!.description }}
              </p>
            }

            <!-- Social Links -->
            <div class="flex space-x-3">
              @if (company()?.metadata?.whatsapp) {
                <a
                  [href]="'https://wa.me/' + company()!.metadata!.whatsapp.replace('+', '')"
                  target="_blank"
                  class="social-link"
                  [ngStyle]="linkStyles()"
                  title="WhatsApp">
                  <i class="fab fa-whatsapp text-xl"></i>
                </a>
              }
              @if (company()?.facebook) {
                <a
                  [href]="company()!.facebook"
                  target="_blank"
                  class="social-link"
                  [ngStyle]="linkStyles()"
                  title="Facebook">
                  <i class="fab fa-facebook text-xl"></i>
                </a>
              }
              @if (company()?.instagram) {
                <a
                  [href]="company()!.instagram"
                  target="_blank"
                  class="social-link"
                  [ngStyle]="linkStyles()"
                  title="Instagram">
                  <i class="fab fa-instagram text-xl"></i>
                </a>
              }
              @if (company()?.twitter) {
                <a
                  [href]="company()!.twitter"
                  target="_blank"
                  class="social-link"
                  [ngStyle]="linkStyles()"
                  title="Twitter">
                  <i class="fab fa-twitter text-xl"></i>
                </a>
              }
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-section">
            <h4 class="text-lg font-semibold mb-4" [ngStyle]="headingStyles()">
              Quick Links
            </h4>
            <ul class="space-y-2">
              @for (page of footerPages(); track page.id) {
                <li>
                  <a
                    [routerLink]="getPageRoute(page)"
                    class="footer-link"
                    [ngStyle]="linkStyles()">
                    {{ page.name }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="footer-section">
            <h4 class="text-lg font-semibold mb-4" [ngStyle]="headingStyles()">
              Contact Info
            </h4>
            <div class="space-y-2">
              @if (company()?.email) {
                <div class="contact-item">
                  <i class="fas fa-envelope mr-2" [ngStyle]="iconStyles()"></i>
                  <a
                    [href]="'mailto:' + company()!.email"
                    class="footer-link"
                    [ngStyle]="linkStyles()">
                    {{ company()!.email }}
                  </a>
                </div>
              }
              @if (company()?.phone) {
                <div class="contact-item">
                  <i class="fas fa-phone mr-2" [ngStyle]="iconStyles()"></i>
                  <a
                    [href]="'tel:' + company()!.phone"
                    class="footer-link"
                    [ngStyle]="linkStyles()">
                    {{ company()!.phone }}
                  </a>
                </div>
              }
              @if (company()?.address) {
                <div class="contact-item">
                  <i class="fas fa-map-marker-alt mr-2" [ngStyle]="iconStyles()"></i>
                  <span class="text-sm" [ngStyle]="textStyles()">
                    {{ company()!.address }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Business Hours (if we add this to company metadata later) -->
          <div class="footer-section">
            <h4 class="text-lg font-semibold mb-4" [ngStyle]="headingStyles()">
              Business Hours
            </h4>
            <div class="space-y-1 text-sm" [ngStyle]="textStyles()">
              <div>Mon-Fri: 9:00 AM - 6:00 PM</div>
              <div>Saturday: 10:00 AM - 4:00 PM</div>
              <div>Sunday: Closed</div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="border-t mt-8 pt-6" [ngStyle]="borderStyles()">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-sm mb-4 md:mb-0" [ngStyle]="textStyles()">
              &copy; {{ currentYear }} {{ company()?.name }}. All rights reserved.
            </div>
            <div class="flex space-x-4 text-sm">
              <a routerLink="/privacy" class="footer-link" [ngStyle]="linkStyles()">
                Privacy Policy
              </a>
              <a routerLink="/terms" class="footer-link" [ngStyle]="linkStyles()">
                Terms of Service
              </a>
              <a routerLink="/returns" class="footer-link" [ngStyle]="linkStyles()">
                Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .dynamic-footer {
      margin-top: auto;
    }

    .footer-logo {
      height: 2rem;
      width: auto;
      object-fit: contain;
    }

    .footer-link {
      transition: opacity 0.2s ease;
      text-decoration: none;
    }

    .footer-link:hover {
      opacity: 0.8;
    }

    .social-link {
      transition: transform 0.2s ease;
    }

    .social-link:hover {
      transform: translateY(-2px);
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .footer-section {
        text-align: center;
      }

      .contact-item {
        justify-content: center;
      }
    }
  `]
})
export class DynamicFooterComponent {
  private contextService = inject(ContextService);

  // Computed values
  company = computed(() => this.contextService.currentCompany());
  currentYear = new Date().getFullYear();

  footerPages = computed(() => {
    const pages = this.company()?.metadata?.pages || [];
    // Show important pages in footer
    return pages.filter((page: CompanyPage) =>
      ['about-us', 'contact-us', 'privacy', 'terms'].includes(page.id) ||
      page.showOnNav === 'Yes'
    );
  });

  // Dynamic styling
  footerStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) {
      return {
        'background-color': '#1f2937',
        'color': '#ffffff'
      };
    }

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'background-color': theme['background'] || '#1f2937',
      'color': theme['text'] || '#ffffff'
    };
  });

  headingStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return { 'color': '#ffffff' };

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['primary'] || '#ffffff'
    };
  });

  textStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return { 'color': '#d1d5db' };

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['muted'] || '#d1d5db'
    };
  });

  linkStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return { 'color': '#e5e7eb' };

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['text'] || '#e5e7eb'
    };
  });

  iconStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return { 'color': '#9ca3af' };

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['muted'] || '#9ca3af'
    };
  });

  logoStyles = computed(() => {
    return {
      'max-height': '2rem',
      'width': 'auto'
    };
  });

  borderStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return { 'border-top-color': '#374151' };

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'border-top-color': theme['border'] || '#374151'
    };
  });

  getPageRoute(page: CompanyPage): string {
    // Same routing logic as navbar
    switch (page.id) {
      case 'home':
        return '/';
      case 'products':
        return '/shop';
      case 'login':
        return '/login';
      case 'account':
        return '/account';
      case 'checkout':
        return '/checkout';
      case 'contact-us':
        return '/contact';
      case 'about-us':
        return '/about';
      default:
        return `/page/${page.id}`;
    }
  }

  private getThemeColors(themeColors: any[]): Record<string, string> {
    const theme: Record<string, string> = {};

    themeColors.forEach(color => {
      switch (color.variable) {
        case '--color-background':
          theme['background'] = color.value;
          break;
        case '--color-surface':
          theme['surface'] = color.value;
          break;
        case '--color-border':
          theme['border'] = color.value;
          break;
        case '--color-text':
          theme['text'] = color.value;
          break;
        case '--color-primary':
          theme['primary'] = color.value;
          break;
        case '--color-secondary':
          theme['secondary'] = color.value;
          break;
        case '--color-muted':
          theme['muted'] = color.value;
          break;
      }
    });

    return theme;
  }
}
