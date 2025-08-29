import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';

export type AppShell = 'storefront' | 'dashboard' | 'editor';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-shell" [attr.data-app]="currentApp()">
      <!-- App Shell Header -->
      <div class="app-shell-header" *ngIf="showAppSwitcher()">
        <div class="app-switcher">
          <button
            *ngFor="let app of apps"
            [class.active]="currentApp() === app.key"
            (click)="switchApp(app.key)"
            class="app-button"
          >
            <span class="app-icon">{{ app.icon }}</span>
            <span class="app-name">{{ app.name }}</span>
          </button>
        </div>

        <div class="user-info" *ngIf="userService.authenticated()">
          <span>{{ userService.user()?.username }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>

      <!-- App Content -->
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-shell-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .app-switcher {
      display: flex;
      gap: 0.5rem;
    }

    .app-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: #f9fafb;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
    }

    .app-button:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .app-button.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .app-icon {
      font-size: 1.2rem;
    }

    .app-name {
      font-weight: 500;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #374151;
    }

    .logout-btn {
      padding: 0.25rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      background: white;
      color: #374151;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-btn:hover {
      background: #f9fafb;
    }

    .app-content {
      flex: 1;
      overflow: hidden;
    }

    /* Hide app switcher for storefront */
    .app-shell[data-app="storefront"] .app-shell-header {
      display: none;
    }

    .app-shell[data-app="storefront"] .app-content {
      height: 100vh;
    }
  `]
})
export class AppShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly currentApp = signal<AppShell>('storefront');

  readonly apps = [
    { key: 'storefront' as AppShell, name: 'Storefront', icon: '🏪' },
    { key: 'dashboard' as AppShell, name: 'Dashboard', icon: '📊' },
    { key: 'editor' as AppShell, name: 'Editor', icon: '✏️' }
  ];

  // We'll inject this when available
  userService: any = {
    authenticated: () => false,
    user: () => null,
    logout: () => {}
  };

  ngOnInit(): void {
    // Detect current app from URL
    this.detectCurrentApp();

    // Listen to route changes
    this.router.events.subscribe(() => {
      this.detectCurrentApp();
    });
  }

  private detectCurrentApp(): void {
    const url = this.router.url;

    if (url.startsWith('/dashboard')) {
      this.currentApp.set('dashboard');
    } else if (url.startsWith('/editor')) {
      this.currentApp.set('editor');
    } else {
      this.currentApp.set('storefront');
    }
  }

  switchApp(app: AppShell): void {
    switch (app) {
      case 'storefront':
        this.router.navigate(['/']);
        break;
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        break;
      case 'editor':
        this.router.navigate(['/editor']);
        break;
    }
  }

  showAppSwitcher(): boolean {
    return this.currentApp() !== 'storefront';
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
