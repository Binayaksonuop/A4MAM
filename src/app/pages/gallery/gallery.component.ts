import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GalleryService } from '../../services/gallery.service';
import { LightboxService } from '../../services/lightbox.service';



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
  imagesLoaded = false;
  activeFilter = 'all';
  private filteredImages: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private galleryService: GalleryService,
    private lightboxService: LightboxService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // 1. Load local images immediately
    this.setLocalImages();

    // 2. Then try to load from API if browser
    if (this.isBrowser) {
      this.galleryService.getImages().subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.allImagesRaw = data;
            const classes = ['item-tall', 'item-short', 'item-wide', ''];
            const apiImages = data.map((img, index) => {
              return {
                src: img.url,
                title: img.title,
                tag: img.category,
                location: img.location,
                class: classes[index % classes.length]
              };
            });
            // Merge or replace? Let's replace if API has data
            this.images = apiImages;
            this.cdr.detectChanges();
            this.refreshAnimations();
          }
        },
        error: () => console.warn('Gallery API unavailable.')
      });
    }
  }

  private setLocalImages(): void {
    const localImages = [
      { src: 'assets/images/gallery/mam_gallery_1.jpg', title: 'Community Outreach', tag: 'Impact', location: 'Odisha' },
      { src: 'assets/images/gallery/mam_gallery_2.jpg', title: 'Health Screening', tag: 'Clinical', location: 'Telangana' },
      { src: 'assets/images/gallery/mam_gallery_3.jpg', title: 'Nutrition Distribution', tag: 'Mission', location: 'Madhya Pradesh' },
      { src: 'assets/images/gallery/mam_gallery_4.jpg', title: 'Clinical Monitoring', tag: 'Healthcare', location: 'Odisha' },
      { src: 'assets/images/gallery/mam_gallery_5.jpg', title: 'Community Engagement', tag: 'Awareness', location: 'Rural India' },
      { src: 'assets/images/gallery/mam_gallery_6.jpg', title: 'Maternal Health Support', tag: 'Clinical', location: 'Odisha' },
      { src: 'assets/images/gallery/mam_gallery_7.jpg', title: 'Village Health Camp', tag: 'Impact', location: 'Telangana' },
      { src: 'assets/images/gallery/mam_gallery_8.jpg', title: 'Growth Monitoring', tag: 'Clinical', location: 'Madhya Pradesh' },
      { src: 'assets/images/gallery/mam_gallery_9.jpg', title: 'Nutritional Counseling', tag: 'Education', location: 'Odisha' },
      { src: 'assets/images/gallery/mam_gallery_10.jpg', title: 'Spirulina Supplementation', tag: 'Mission', location: 'Telangana' },
      { src: 'assets/images/gallery/mam_gallery_11.jpg', title: 'Impact Verification', tag: 'Research', location: 'India' },
      
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-04 at 12.19.25 PM.jpeg', title: 'Field Implementation', tag: 'Action', location: 'Village Camp' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.39 PM (1).jpeg', title: 'Child Recovery Progress', tag: 'Impact', location: 'Odisha' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.40 PM (1).jpeg', title: 'Spirulina Distribution', tag: 'Mission', location: 'Odisha' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.41 PM (1).jpeg', title: 'Nutrition Assessment', tag: 'Clinical', location: 'Odisha' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.46 PM (3).jpeg', title: 'Health Worker Training', tag: 'Education', location: 'Bhubaneswar' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.53 PM (2).jpeg', title: 'Community Support', tag: 'Impact', location: 'Village Level' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.56 PM (2).jpeg', title: 'Recovery Documentation', tag: 'Research', location: 'Odisha' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.02.44 PM.jpeg', title: 'Impact Showcase', tag: 'Success', location: 'Project Site' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.04.46 PM (1).jpeg', title: 'Clinical Data Review', tag: 'Research', location: 'HQ' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.08.53 PM.jpeg', title: 'Stakeholder Meeting', tag: 'Partnership', location: 'Bhubaneswar' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.12.47 PM.jpeg', title: 'Mission Expansion', tag: 'Action', location: 'India' },
      { src: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.14.40 PM (2).jpeg', title: 'Project Verification', tag: 'Audit', location: 'Odisha' }
    ];

    const classes = ['item-tall', 'item-short', 'item-wide', ''];
    this.images = localImages.map((img, index) => ({
      ...img,
      class: classes[index % classes.length]
    }));
    this.filteredImages = [...this.images];
    this.imagesLoaded = true;
    this.cdr.detectChanges();
    this.refreshAnimations();
  }

  filterGallery(category: string): void {
    this.activeFilter = category;
    const btns = Array.from(document.querySelectorAll('.gallery-filter-btn'));
    btns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = btns.find(btn => btn.textContent?.includes(category === 'all' ? 'All' : category));
    if (activeBtn) activeBtn.classList.add('active');

    if (category === 'all') {
      this.images = this.filteredImages.length ? this.filteredImages : this.images;
    } else {
      const source = this.filteredImages.length ? this.filteredImages : this.images;
      this.images = source.filter(img => img.tag === category);
    }
    this.cdr.detectChanges();
    this.refreshAnimations();
  }

  onImageLoad(): void {
    if (!this.imagesLoaded) {
      this.imagesLoaded = true;
      this.cdr.detectChanges();
    }
  }

  private refreshAnimations(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initAnimations();
        ScrollTrigger.refresh();
      }, 500);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.images.length > 0) {
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
      // Use set to ensure they are visible first, then animate
      gsap.set(el, { opacity: 1, visibility: 'visible' });
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
}
