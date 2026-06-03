import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SiteSettings {
  branding?: {
    logoUrl?: string;
    faviconUrl?: string;
  };
  tracking?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    facebookPixelId?: string;
  };
  contact?: {
    headOffice?: string;
    branchOffice?: string;
    email?: string;
    phone?: string;
  };
  social?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
  marquee?: { text: string; icon: string }[];
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private publicApiUrl = `${environment.apiUrl}/public/settings`;
  private adminApiUrl = `${environment.apiUrl}/admin/settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<ApiResponse<SiteSettings>> {
    return this.http.get<ApiResponse<SiteSettings>>(this.publicApiUrl);
  }

  updateSettings(settings: SiteSettings): Observable<ApiResponse<SiteSettings>> {
    return this.http.put<ApiResponse<SiteSettings>>(this.adminApiUrl, settings);
  }
}
