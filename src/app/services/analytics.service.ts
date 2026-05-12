import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser: boolean;
  private gaId: string = 'G-XXXXXXXXXX';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  init(): void {
    if (!this.isBrowser) return;

    if (typeof window !== 'undefined' && !(window as any).gtag) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      
      const gtag = (...args: any[]) => {
        (window as any).dataLayer.push(args);
      };
      
      (window as any).gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', this.gaId, {
        page_path: window.location.pathname
      });
    }
  }

  trackPageView(pagePath: string): void {
    if (!this.isBrowser || !(window as any).gtag) return;
    
    (window as any).gtag('config', this.gaId, {
      page_path: pagePath
    });
  }

  trackEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.isBrowser || !(window as any).gtag) return;
    
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  setGaId(gaId: string): void {
    this.gaId = gaId;
  }
}
