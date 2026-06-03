import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { TitleStrategy } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    
    if (title !== undefined) {
      this.title.setTitle(title);
      
      this.meta.updateTag({
        property: 'og:title',
        content: title
      });
      
      this.meta.updateTag({
        name: 'twitter:title',
        content: title
      });

      this.updateCanonicalUrl(routerState.url);
    }
  }

  private updateCanonicalUrl(url: string) {
    const head = this.doc.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.doc.querySelector(`link[rel='canonical']`) || null;
    
    if (element === null) {
      element = this.doc.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    
    const cleanUrl = url.split('?')[0]; // Remove query params for canonical
    element.setAttribute('href', `https://a4mam.org${cleanUrl}`);
  }
}
