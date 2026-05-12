import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { TitleStrategy } from '@angular/router';

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private title: Title,
    private meta: Meta
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
    }
  }
}
