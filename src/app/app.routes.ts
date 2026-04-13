import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'nutrition-details',
    loadComponent: () => import('./nutrition-details/nutrition-details.component').then(m => m.NutritionDetailsComponent),
    title: 'Nutrition Details | A4MAM'
  },
  {
    path: 'impact',
    loadComponent: () => import('./pages/impact/impact.component').then(m => m.ImpactComponent),
    title: 'Live Telemetry | A4MAM'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Our Mission | A4MAM'
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
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found | A4MAM'
  }
];
