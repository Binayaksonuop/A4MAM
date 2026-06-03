import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public loadScript(): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.isBrowser) return resolve(false);
      
      if ((window as any).Razorpay) {
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  public openCheckout(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isBrowser || !(window as any).Razorpay) {
        return reject('Razorpay SDK not loaded');
      }

      options.handler = (response: any) => {
        resolve(response);
      };

      options.modal = {
        ondismiss: () => {
          reject('Payment modal closed');
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }
}
