import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-nutrition-details',
  standalone: true,
  imports: [NgOptimizedImage, RouterModule],
  templateUrl: './nutrition-details.component.html',
  styleUrl: './nutrition-details.component.css'
})
export class NutritionDetailsComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.zone.runOutsideAngular(() => {
      this.initAnimations();
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }

  private initAnimations(): void {
    // HERO ENTRANCE
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    gsap.set(['.hero-badge-scientific', '.hero-title-stagger', '.hero-text-stagger', '.hero-actions-container'], { opacity: 0, y: 40 });
    heroTl
      .to('.hero-badge-scientific', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      .to('.hero-title-stagger', { opacity: 1, y: 0, duration: 1.3 }, '-=0.6')
      .to('.hero-text-stagger', { opacity: 1, y: 0, duration: 1.1 }, '-=0.8')
      .to('.hero-actions-container', { opacity: 1, y: 0, duration: 1 }, '-=0.7');

    // MOLECULAR CARDS — staggered on scroll
    gsap.utils.toArray('.molecular-card').forEach((card: any, i: number) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out', delay: i * 0.15,
          scrollTrigger: { trigger: '#molecular-profile', start: 'top 75%', once: true }
        }
      );
    });

    // DIGEST METER BARS — animate width on scroll
    gsap.utils.toArray('.bar-fill').forEach((bar: any) => {
      const targetWidth = bar.style.width || '100%';
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: targetWidth, duration: 1.8, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 85%', once: true }
        }
      );
    });

    // FLOATING STAT CARDS on recovery image
    gsap.utils.toArray('.floating-stat-card').forEach((card: any, i: number) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.4)', delay: 0.5 + i * 0.2,
          scrollTrigger: { trigger: '#recovery-dynamics', start: 'top 75%', once: true }
        }
      );
      // Floating idle animation
      gsap.to(card, {
        y: i % 2 === 0 ? -10 : 10,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    // RECOVERY STEPS — staggered reveal
    gsap.utils.toArray('.recovery-step').forEach((step: any, i: number) => {
      gsap.fromTo(step,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: i * 0.15,
          scrollTrigger: { trigger: '.recovery-steps', start: 'top 80%', once: true }
        }
      );
    });

    // COMPARISON BARS — animate on scroll
    gsap.utils.toArray('.comp-bar .bar-fill').forEach((bar: any) => {
      const targetWidth = bar.style.width || '100%';
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: targetWidth, duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 85%', once: true }
        }
      );
    });

    // COMPARISON CARDS
    gsap.utils.toArray('.comparison-card-v2').forEach((card: any, i: number) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: i * 0.2,
          scrollTrigger: { trigger: '#comparative-efficiency', start: 'top 75%', once: true }
        }
      );
    });

    // CTA
    gsap.fromTo('.nutrition-cta h2',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.nutrition-cta', start: 'top 80%', once: true }
      }
    );

    // CLINICAL TIMELINE progress fill
    gsap.fromTo('.nd-progress-fill-inner',
      { width: '0%' },
      {
        width: '100%', duration: 3, ease: 'power2.out',
        scrollTrigger: { trigger: '.nd-clinical-timeline', start: 'top 80%', once: true }
      }
    );

    // STAT STRIP numbers count-up
    const ndStats = [
      { el: '.nd-stat-num.emerald', target: 65, suffix: '%' },
      { el: '.nd-stat-num.blue', target: 95, suffix: '%' },
      { el: '.nd-stat-num.amber', target: 58, suffix: 'x' },
      { el: '.nd-stat-num.purple', target: 100, suffix: '%' }
    ];
    ndStats.forEach(({ el, target, suffix }) => {
      const elem = document.querySelector(el) as HTMLElement;
      if (!elem) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: '.nd-stat-strip', start: 'top 85%', once: true },
        onUpdate: () => { elem.textContent = Math.round(obj.val) + suffix; }
      });
    });

    ScrollTrigger.refresh();
  }
}
