import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-header">
          <h2>Dashboard</h2>
        </div>

        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard')"
                [class.active]="currentRoute() === '/dashboard'"
                class="nav-button"
              >
                📊 Overview
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/products')"
                [class.active]="currentRoute().startsWith('/dashboard/products')"
                class="nav-button"
              >
                📦 Products
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/categories')"
                [class.active]="currentRoute().startsWith('/dashboard/categories')"
                class="nav-button"
              >
                🏷️ Categories
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/orders')"
                [class.active]="currentRoute().startsWith('/dashboard/orders')"
                class="nav-button"
              >
                🛒 Orders
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/customers')"
                [class.active]="currentRoute().startsWith('/dashboard/customers')"
                class="nav-button"
              >
                👥 Customers
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/websites')"
                [class.active]="currentRoute().startsWith('/dashboard/websites')"
                class="nav-button"
              >
                🌐 Websites
              </button>
            </li>
            <li class="nav-item">
              <button
                (click)="navigateTo('/dashboard/settings')"
                [class.active]="currentRoute().startsWith('/dashboard/settings')"
                class="nav-button"
              >
                ⚙️ Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="dashboard-main">
        <div class="dashboard-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      height: 100vh;
      background-color: #f8fafc;
    }

    .dashboard-sidebar {
      width: 256px;
      background-color: white;
      border-right: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .sidebar-header h2 {
      margin: 0;
      color: #1a202c;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .sidebar-nav {
      padding: 1rem 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin: 0;
    }

    .nav-button {
      width: 100%;
      padding: 0.75rem 1.5rem;
      text-align: left;
      border: none;
      background: transparent;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-button:hover {
      background-color: #f7fafc;
      color: #2d3748;
    }

    .nav-button.active {
      background-color: #ebf8ff;
      color: #3182ce;
      border-right: 3px solid #3182ce;
    }

    .dashboard-main {
      flex: 1;
      overflow: hidden;
    }

    .dashboard-content {
      height: 100%;
      overflow-y: auto;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .dashboard-layout {
        flex-direction: column;
      }

      .dashboard-sidebar {
        width: 100%;
        height: auto;
      }

      .dashboard-content {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  private readonly router = inject(Router);

  readonly currentRoute = signal<string>('');

  constructor() {
    // Update current route
    this.currentRoute.set(this.router.url);

    // Listen to route changes
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
