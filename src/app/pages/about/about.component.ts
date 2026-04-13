import { Component, AfterViewInit, PLATFORM_ID, Inject, HostListener } from '@angular/core';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initAnimations();
      this.initParallax();
    }
  }

  initAnimations() {
    const tl = gsap.timeline();
    // Pre-hide elements
    gsap.set(['.hero-text-reveal', '.hero-subtext-reveal', '.pill-ultra'], { opacity: 0, y: 30 });
    gsap.set('.card-premium', { opacity: 0, y: 50 });

    tl.to('.pill-ultra', { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.2 })
      .to('.hero-text-reveal', { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6')
      .to('.hero-subtext-reveal', { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8');

    // Cards Scroll
    gsap.utils.toArray('.scroll-card').forEach((card: any, i) => {
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: i * 0.1
      });
    });

    // Bio Process Loop
    gsap.utils.toArray('.process-node').forEach((node: any, i) => {
      gsap.fromTo(node, 
        { opacity: 0, x: -50 },
        {
          scrollTrigger: { trigger: '.process-container', start: 'top 70%' },
          opacity: 1, x: 0, duration: 1, ease: 'back.out(1.5)', delay: i * 0.2
        }
      );
    });

    ScrollTrigger.refresh();
  }

  initParallax() {
    // Subtle parallax on mouse move for the hero background
    if (this.isBrowser) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        gsap.to('.ambient-glow', { x: x, y: y, duration: 1, ease: 'power2.out' });
      });
    }
  }
}
