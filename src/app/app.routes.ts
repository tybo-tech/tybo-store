import { Routes } from '@angular/router';

export const routes: Routes = [
  // Storefront routes (default)
  {
    path: '',
    loadComponent: () => import('./apps/storefront/pages/home.component').then(m => m.StorefrontHomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./components/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },

  // Dashboard routes
  {
    path: 'dashboard',
    loadComponent: () => import('./apps/dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/api-test.component').then(m => m.ApiTestComponent) // Temporary dashboard home
      },
      {
        path: 'products',
        loadComponent: () => import('./components/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/shopping-cart-example.component').then(m => m.ShoppingCartExampleComponent)
      }
    ]
  },

  // Editor routes
  {
    path: 'editor',
    loadComponent: () => import('./apps/editor/editor-layout.component').then(m => m.EditorLayoutComponent)
  },

  // Fallback route
  {
    path: '**',
    redirectTo: ''
  }
];
