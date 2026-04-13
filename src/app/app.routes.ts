import { Routes } from '@angular/router';
import { NutritionDetailsComponent } from './nutrition-details/nutrition-details.component';
import { ImpactComponent } from './pages/impact/impact.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DonateComponent } from './pages/donate/donate.component';

export const routes: Routes = [
  { path: 'nutrition-details', component: NutritionDetailsComponent },
  { path: 'impact', component: ImpactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'donate', component: DonateComponent }
];
