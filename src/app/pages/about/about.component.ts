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
    }
  }

  initAnimations() {
    const tl = gsap.timeline();

    // Only set elements that exist
    const heroText = document.querySelector('.hero-text-reveal');
    const heroSub = document.querySelector('.hero-subtext-reveal');
    const pill = document.querySelector('.pill-ultra');

    if (pill) gsap.set(pill, { opacity: 0, y: 30 });
    if (heroText) gsap.set(heroText, { opacity: 0, y: 30 });
    if (heroSub) gsap.set(heroSub, { opacity: 0, y: 30 });

    const cardPremiums = document.querySelectorAll('.card-premium');
    if (cardPremiums.length) gsap.set('.card-premium', { opacity: 0, y: 50 });

    if (pill) tl.to(pill, { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
    if (heroText) tl.to(heroText, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6');
    if (heroSub) tl.to(heroSub, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8');

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

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBrowser) return;

    const glows = document.querySelectorAll('.ambient-glow');
    if (glows.length) {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      gsap.to('.ambient-glow', { x: x, y: y, duration: 1, ease: 'power2.out' });
    }
  }
}
