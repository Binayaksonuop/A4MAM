import { Component, AfterViewInit, PLATFORM_ID, Inject, HostListener, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        this.initAnimations();
      });
    }
  }

  initAnimations() {
    const tl = gsap.timeline();

    // Elements
    const heroText = document.querySelector('.hero-text-reveal');
    const heroSub = document.querySelector('.hero-subtext-reveal');
    const pill = document.querySelector('.pill-ultra');
    const heroVisual = document.querySelector('.about-hero-visual-v6');

    if (pill) gsap.set(pill, { opacity: 0, y: 30 });
    if (heroText) gsap.set(heroText, { opacity: 0, y: 30 });
    if (heroSub) gsap.set(heroSub, { opacity: 0, y: 30 });
    if (heroVisual) gsap.set(heroVisual, { opacity: 0, scale: 0.95, y: 40 });

    if (pill) tl.to(pill, { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
    if (heroText) tl.to(heroText, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6');
    if (heroSub) tl.to(heroSub, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8');
    if (heroVisual) tl.to(heroVisual, { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out' }, '-=1');

    // Cards Scroll
    gsap.utils.toArray('.scroll-card').forEach((card: any, i) => {
      gsap.set(card, { opacity: 0, y: 40 });
      gsap.to(card, {
        scrollTrigger: { 
          trigger: card, 
          start: 'top 85%', 
          toggleActions: 'play none none reverse' 
        },
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: 'power3.out', 
        delay: i % 3 * 0.1, 
        force3D: true
      });
    });

    // Bio Process Loop - Updated selector
    gsap.utils.toArray('.node-v6').forEach((node: any, i) => {
      gsap.fromTo(node,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: { 
            trigger: '.process-container', 
            start: 'top 75%' 
          },
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'back.out(1.2)', 
          delay: i * 0.15
        }
      );
    });

    // CTA Reveal
    const cta = document.querySelector('.cta-card-v6');
    if (cta) {
      gsap.fromTo(cta,
        { opacity: 0, scale: 0.95, y: 50 },
        {
          scrollTrigger: { trigger: cta, start: 'top 85%' },
          opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out'
        }
      );
    }

    // COUNTER ANIMATION (new)
    const counters = document.querySelectorAll('.about-counter-num');
    counters.forEach((counter: any) => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-stats-ticker',
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val).toLocaleString('en-IN');
        }
      });
    });

    // METER BARS (new)
    gsap.utils.toArray('.stat-meter-fill').forEach((bar: any) => {
      const width = bar.getAttribute('data-width') || '50%';
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: width,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
        }
      );
    });

    // TIMELINE items
    gsap.utils.toArray('.timeline-item').forEach((item: any, i: number) => {
      const dir = item.classList.contains('left') ? -60 : 60;
      gsap.fromTo(item,
        { opacity: 0, x: dir },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
          delay: i * 0.1
        }
      );
    });

    ScrollTrigger.refresh();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        ScrollTrigger.refresh();
      });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      const glows = document.querySelectorAll('.ambient-glow');
      if (glows.length) {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        gsap.to('.ambient-glow', { x: x, y: y, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
      }
    });
  }
}
