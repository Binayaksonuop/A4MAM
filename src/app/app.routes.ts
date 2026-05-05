import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'MAM - Mission Against Malnutrition'
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop-listing/shop-listing.component').then(m => m.ShopListingComponent),
    title: 'Shop | A4MAM'
  },
  {
    path: 'research/intergenerational-malnutrition',
    loadComponent: () => import('./pages/research/research-article/research-article.component').then(m => m.ResearchArticleComponent),
    title: 'Research | Intergenerational Malnutrition'
  },
  {
    path: 'nutrition-details',
    loadComponent: () => import('./nutrition-details/nutrition-details.component').then(m => m.NutritionDetailsComponent),
    title: 'Nutrition Details | A4MAM'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Our Mission | A4MAM'
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Impact Gallery | A4MAM'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us | A4MAM'
  },
  {
    path: 'donate',
    loadComponent: () => import('./pages/donate/donate.component').then(m => m.DonateComponent),
    title: 'Donate | A4MAM'
  },
  {
    path: 'shop/chicky-bars',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Chicky Bars | Shop A4MAM'
  },
  {
    path: 'shop/powder',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Spirulina Powder | Shop A4MAM'
  },
  {
    path: 'shop/capsules',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Supplement Capsules | Shop A4MAM'
  },
  {
    path: 'shop/child-kit',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Child Nutrition Kit | Shop A4MAM'
  },
  {
    path: 'shop/maternal-kit',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Maternal Health Kit | Shop A4MAM'
  },
  {
    path: 'shop/bulk',
    loadComponent: () => import('./pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent),
    title: 'Bulk Orders | Shop A4MAM'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/shop/cart/cart.component').then(m => m.CartComponent),
    title: 'Your Cart | A4MAM'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/shop/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Secure Checkout | A4MAM'
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/shop/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    title: 'Order Confirmed! | A4MAM'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login | A4MAM'
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Mission Control | A4MAM'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Route Not Found | A4MAM'
  }
];
