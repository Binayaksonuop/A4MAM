import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule, NgOptimizedImage } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './impact.component.html',
  styleUrls: ['./impact.component.css']
})
export class ImpactComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
      this.animateLiveNodes();
    }
  }

  initAnimations() {
    const tl = gsap.timeline();
    
    const pill = document.querySelector('.impact-pill');
    const heroText = document.querySelector('.hero-impact-text');
    const heroSub = document.querySelector('.hero-impact-subtext');

    if (pill) gsap.set(pill, { opacity: 0, y: 30 });
    if (heroText) gsap.set(heroText, { opacity: 0, y: 30 });
    if (heroSub) gsap.set(heroSub, { opacity: 0, y: 30 });

    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length) gsap.set('.metric-card', { opacity: 0, y: 40 });

    if (pill) tl.to(pill, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    if (heroText) tl.to(heroText, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6');
    if (heroSub) tl.to(heroSub, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8');

    if (metricCards.length && document.querySelector('.metric-grid')) {
      gsap.to('.metric-card', {
        scrollTrigger: { trigger: '.metric-grid', start: 'top 80%' },
        opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'back.out(1.4)'
      });
    }

    const dataPanel = document.querySelector('.data-panel');
    if (dataPanel) {
      gsap.to(dataPanel, {
        scrollTrigger: { trigger: dataPanel, start: 'top 85%' },
        opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out'
      });
    }
  }

  animateLiveNodes() {
    gsap.utils.toArray('.crypto-node').forEach((node: any) => {
      gsap.to(node, {
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 0.5 + 1,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }
}
