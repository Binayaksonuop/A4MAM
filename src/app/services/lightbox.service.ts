import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LightboxData {
  src: string;
  title?: string;
  location?: string;
  tag?: string;
  images?: any[]; // Array of images for navigation
  currentIndex?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  private lightboxSubject = new BehaviorSubject<LightboxData | null>(null);
  public lightboxData$: Observable<LightboxData | null> = this.lightboxSubject.asObservable();

  constructor() {}

  open(data: LightboxData): void {
    this.lightboxSubject.next(data);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  close(): void {
    this.lightboxSubject.next(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  next(): void {
    const current = this.lightboxSubject.getValue();
    if (current && current.images && current.currentIndex !== undefined) {
      const nextIndex = (current.currentIndex + 1) % current.images.length;
      const nextImg = current.images[nextIndex];
      this.lightboxSubject.next({
        ...current,
        src: nextImg.url || nextImg.src,
        title: nextImg.title,
        location: nextImg.location,
        tag: nextImg.category || nextImg.tag,
        currentIndex: nextIndex
      });
    }
  }

  prev(): void {
    const current = this.lightboxSubject.getValue();
    if (current && current.images && current.currentIndex !== undefined) {
      const prevIndex = (current.currentIndex - 1 + current.images.length) % current.images.length;
      const prevImg = current.images[prevIndex];
      this.lightboxSubject.next({
        ...current,
        src: prevImg.url || prevImg.src,
        title: prevImg.title,
        location: prevImg.location,
        tag: prevImg.category || prevImg.tag,
        currentIndex: prevIndex
      });
    }
  }
}
