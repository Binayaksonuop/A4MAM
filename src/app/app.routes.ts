import { Routes } from '@angular/router';

export const routes: Routes = [
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
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Chicky Bars | Shop A4MAM'
  },
  {
    path: 'shop/powder',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Spirulina Powder | Shop A4MAM'
  },
  {
    path: 'shop/capsules',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Supplement Capsules | Shop A4MAM'
  },
  {
    path: 'shop/child-kit',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Child Nutrition Kit | Shop A4MAM'
  },
  {
    path: 'shop/maternal-kit',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Maternal Health Kit | Shop A4MAM'
  },
  {
    path: 'shop/bulk',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Bulk Orders | Shop A4MAM'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), // Placeholder
    title: 'Your Cart | Shop A4MAM'
  }
];
