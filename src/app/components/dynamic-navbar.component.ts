import { Component, Input, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ContextService, Company, CompanyPage } from '../services/context.service';

@Component({
  selector: 'app-dynamic-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <nav class="dynamic-navbar" [ngStyle]="navbarStyles()">
      <!-- Banner Section (if enabled) -->
      @if (company()?.metadata?.showBanner && bannerMessage()) {
        <div class="banner-section" [ngStyle]="bannerStyles()">
          <div class="container mx-auto px-4">
            <div class="text-center py-2">
              <span class="banner-text" [innerHTML]="bannerMessage()"></span>
            </div>
          </div>
        </div>
      }

      <!-- Main Navigation -->
      <div class="main-nav" [ngStyle]="mainNavStyles()">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">

            <!-- Logo Section -->
            <div class="navbar-brand flex items-center">
              @if (company()?.logo) {
                <img
                  [src]="company()!.logo"
                  [alt]="company()!.name + ' Logo'"
                  class="company-logo"
                  [ngStyle]="logoStyles()"
                  loading="lazy">
              }
              @if (!hideCompanyName) {
                <span class="company-name ml-3 font-bold" [ngStyle]="companyNameStyles()">
                  {{ company()?.name }}
                </span>
              }
            </div>

            <!-- Desktop Navigation Menu -->
            <div class="hidden md:flex items-center space-x-6">
              @for (page of navigationPages(); track page.id) {
                <a
                  [routerLink]="getPageRoute(page)"
                  routerLinkActive="nav-active"
                  class="nav-link"
                  [ngStyle]="navLinkStyles()">
                  {{ page.name }}
                </a>
              }

              <!-- Shopping Cart Icon -->
              <a
                routerLink="/cart"
                class="nav-link cart-link"
                [ngStyle]="navLinkStyles()">
                <i class="fas fa-shopping-cart"></i>
                @if (cartItemCount() > 0) {
                  <span class="cart-badge">{{ cartItemCount() }}</span>
                }
              </a>

              <!-- User Account -->
              <a
                routerLink="/account"
                class="nav-link account-link"
                [ngStyle]="navLinkStyles()">
                <i class="fas fa-user"></i>
              </a>

              <!-- WhatsApp Contact (if available) -->
              @if (company()?.metadata?.whatsapp) {
                <a
                  [href]="'https://wa.me/' + company()!.metadata!.whatsapp.replace('+', '')"
                  target="_blank"
                  class="nav-link whatsapp-link"
                  [ngStyle]="navLinkStyles()"
                  title="Contact us on WhatsApp">
                  <i class="fab fa-whatsapp"></i>
                </a>
              }
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden">
              <button
                class="mobile-menu-btn"
                [ngStyle]="mobileMenuBtnStyles()"
                (click)="toggleMobileMenu()"
                [attr.aria-expanded]="mobileMenuOpen()">
                <i class="fas" [class.fa-bars]="!mobileMenuOpen()" [class.fa-times]="mobileMenuOpen()"></i>
              </button>
            </div>
          </div>

          <!-- Mobile Navigation Menu -->
          @if (mobileMenuOpen()) {
            <div class="mobile-menu md:hidden" [ngStyle]="mobileMenuStyles()">
              <div class="px-2 pt-2 pb-3 space-y-1">
                @for (page of navigationPages(); track page.id) {
                  <a
                    [routerLink]="getPageRoute(page)"
                    routerLinkActive="nav-active"
                    class="mobile-nav-link block px-3 py-2 rounded-md"
                    [ngStyle]="mobileNavLinkStyles()"
                    (click)="closeMobileMenu()">
                    {{ page.name }}
                  </a>
                }

                <!-- Mobile Action Links -->
                <div class="border-t pt-3 mt-3">
                  <a
                    routerLink="/cart"
                    class="mobile-nav-link flex items-center px-3 py-2"
                    [ngStyle]="mobileNavLinkStyles()"
                    (click)="closeMobileMenu()">
                    <i class="fas fa-shopping-cart mr-3"></i>
                    Shopping Cart
                    @if (cartItemCount() > 0) {
                      <span class="ml-auto cart-badge">{{ cartItemCount() }}</span>
                    }
                  </a>

                  <a
                    routerLink="/account"
                    class="mobile-nav-link flex items-center px-3 py-2"
                    [ngStyle]="mobileNavLinkStyles()"
                    (click)="closeMobileMenu()">
                    <i class="fas fa-user mr-3"></i>
                    My Account
                  </a>

                  @if (company()?.metadata?.whatsapp) {
                    <a
                      [href]="'https://wa.me/' + company()!.metadata!.whatsapp.replace('+', '')"
                      target="_blank"
                      class="mobile-nav-link flex items-center px-3 py-2"
                      [ngStyle]="mobileNavLinkStyles()">
                      <i class="fab fa-whatsapp mr-3"></i>
                      WhatsApp Us
                    </a>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .dynamic-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .banner-section {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .company-logo {
      height: auto;
      object-fit: contain;
    }

    .nav-link {
      transition: all 0.2s ease;
      text-decoration: none;
      position: relative;
    }

    .nav-link:hover {
      opacity: 0.8;
    }

    .nav-active {
      font-weight: 600;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc3545;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .cart-link {
      position: relative;
    }

    .mobile-menu {
      border-top: 1px solid rgba(0,0,0,0.1);
    }

    .mobile-menu-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .mobile-nav-link {
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .mobile-nav-link:hover {
      background-color: rgba(0,0,0,0.05);
    }

    /* Responsive logo sizing */
    @media (max-width: 768px) {
      .company-logo {
        max-height: 2rem;
      }
    }

    @media (min-width: 769px) {
      .company-logo {
        max-height: 3rem;
      }
    }
  `]
})
export class DynamicNavbarComponent implements OnInit {
  contextService = inject(ContextService);
  private router = inject(Router);

  // Configuration inputs
  @Input() hideCompanyName: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() fixedPosition: boolean = true;
  @Input() customClasses: string = '';

  // State
  mobileMenuOpen = signal(false);
  cartItemCount = signal(0); // This could be injected from a cart service

  // Computed values from context service
  company = computed(() => this.contextService.currentCompany());

  navigationPages = computed(() => {
    const pages = this.company()?.metadata?.pages || [];
    return pages.filter((page: CompanyPage) => page.showOnNav === 'Yes');
  });

  bannerMessage = computed(() => {
    return this.company()?.metadata?.bannerMessage || '';
  });

  // Dynamic styling based on company theme
  navbarStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'background-color': theme['surface'] || '#ffffff',
      'border-bottom': `1px solid ${theme['border'] || '#e5e5e5'}`
    };
  });

  bannerStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata) return {};

    return {
      'background-color': company.metadata.bannerBg || '#a78141',
      'color': company.metadata.bannerColor || '#ffffff'
    };
  });

  mainNavStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'background-color': theme['surface'] || '#ffffff',
      'color': theme['text'] || '#333333'
    };
  });

  logoStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata) return {};

    // Use responsive logo sizes from company metadata
    return {
      'max-width': 'none', // Will be controlled by CSS classes
      'height': 'auto'
    };
  });

  companyNameStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['primary'] || '#333333',
      'font-size': '1.25rem'
    };
  });

  navLinkStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['text'] || '#333333',
      'font-weight': '500'
    };
  });

  mobileMenuBtnStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['text'] || '#333333'
    };
  });

  mobileMenuStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'background-color': theme['surface'] || '#ffffff',
      'border-top-color': theme['border'] || '#e5e5e5'
    };
  });

  mobileNavLinkStyles = computed(() => {
    const company = this.company();
    if (!company?.metadata?.themeColors) return {};

    const theme = this.getThemeColors(company.metadata.themeColors);
    return {
      'color': theme['text'] || '#333333'
    };
  });

  ngOnInit(): void {
    // Load company data if not already loaded
    console.log('DynamicNavbar - ngOnInit called');
    console.log('Current company:', this.company());
    console.log('Is loading:', this.contextService.isLoading());
    console.log('Error:', this.contextService.error());

    this.contextService.loadCurrentCompany();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  getPageRoute(page: CompanyPage): string {
    // Map company page structure to our routing
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
        // For custom pages, use the page renderer
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

  // Method to update cart count (can be called from cart service)
  updateCartCount(count: number): void {
    this.cartItemCount.set(count);
  }
}
