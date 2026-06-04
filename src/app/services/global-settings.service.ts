import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SiteSettings {
  branding: {
    logoUrl: string;
    faviconUrl: string;
  };
  tracking: {
    googleAnalyticsId: string;
    googleTagManagerId: string;
    facebookPixelId: string;
  };
  contact: {
    headOffice: string;
    branchOffice: string;
    email: string;
    phone: string;
  };
  social: {
    linkedin: string;
    facebook: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
  };
  marquee: Array<{ text: string; icon: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  // Using Signals for state management
  public settings = signal<SiteSettings | null>(null);
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  public loadSettings() {
    this.loading.set(true);
    this.http.get<{ success: boolean; data: SiteSettings }>(this.apiUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.settings.set(response.data);
          this.injectTrackingCodes(response.data.tracking);
        }
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load global settings');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  private injectTrackingCodes(tracking: any) {
    // Only inject in browser environment
    if (typeof window === 'undefined') return;

    // Inject logic can be added here if needed for GTM/GA/Pixel
  }
}
