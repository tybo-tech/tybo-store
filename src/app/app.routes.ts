import { Routes } from '@angular/router';

export const routes: Routes = [
  // Storefront routes (default) - dynamic routing for all database pages
  {
    path: '',
    loadComponent: () =>
      import('./pages/page.component').then((m) => m.PageComponent),
    data: { pageId: 'home' }
  },
  {
    path: ':pageId',
    loadComponent: () =>
      import('./pages/page.component').then((m) => m.PageComponent),
  },

  // Dashboard routes
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./apps/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/api-test.component').then(
            (m) => m.ApiTestComponent
          ), // Temporary dashboard home
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/shopping-cart-example.component').then(
            (m) => m.ShoppingCartExampleComponent
          ),
      },
    ],
  },

  // Editor routes
  {
    path: 'editor/:pageId',
    loadComponent: () =>
      import('./apps/editor/pages/editor-page.component').then(
        (m) => m.EditorPageComponent
      ),
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('./apps/editor/editor-layout.component').then(
        (m) => m.EditorLayoutComponent
      ),
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '',
  },
];
