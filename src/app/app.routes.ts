import { Routes } from '@angular/router';

export const routes: Routes = [
  // Storefront routes (default)
  {
    path: '',
    loadComponent: () => import('./pages/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop-page.component').then(m => m.ShopPageComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/category-showcase.component').then(m => m.CategoryShowcaseComponent)
  },
  {
    path: 'icons',
    loadComponent: () => import('./components/icon-examples.component').then(m => m.IconExamplesComponent)
  },
  {
    path: 'page/:pageId',
    loadComponent: () => import('./pages/page.component').then(m => m.PageComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page.component').then(m => m.CartPageComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account-page.component').then(m => m.AccountPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/page.component').then(m => m.PageComponent),
    data: { pageId: 'contact-us' }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/page.component').then(m => m.PageComponent),
    data: { pageId: 'about-us' }
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
    path: 'editor/:pageId',
    loadComponent: () => import('./apps/editor/pages/editor-page.component').then(m => m.EditorPageComponent)
  },
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
