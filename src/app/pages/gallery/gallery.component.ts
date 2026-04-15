import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements AfterViewInit {
  private isBrowser: boolean;
  selectedImage: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initAnimations();
    }
  }

  openLightbox(imageSrc: string): void {
    this.selectedImage = imageSrc;
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }

  closeLightbox(): void {
    this.selectedImage = null;
    if (this.isBrowser) {
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  }

  private initAnimations(): void {
    const reveals = gsap.utils.toArray<HTMLElement>('.gsap-reveal');
    reveals.forEach(el => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
}
