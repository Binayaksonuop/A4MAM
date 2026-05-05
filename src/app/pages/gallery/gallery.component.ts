import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GalleryService } from '../../services/gallery.service';
import { LightboxService } from '../../services/lightbox.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  images: any[] = [];
  private allImagesRaw: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private galleryService: GalleryService,
    private lightboxService: LightboxService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.galleryService.getImages().subscribe(data => {
      this.allImagesRaw = data;
      this.images = data.map((img, index) => ({
        src: img.url,
        title: img.title,
        tag: img.category,
        location: img.location,
        class: index % 3 === 0 ? 'item-tall' : (index % 5 === 0 ? 'item-wide' : '')
      }));

      if (this.isBrowser) {
        setTimeout(() => this.initAnimations(), 100);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initAnimations();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }

  openLightbox(image: any): void {
    const idx = this.images.indexOf(image);
    this.lightboxService.open({
      src: image.src,
      title: image.title,
      tag: image.tag,
      location: image.location,
      images: this.images,
      currentIndex: idx
    });
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
