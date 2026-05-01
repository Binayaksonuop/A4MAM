import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-research-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './research-article.component.html',
  styleUrls: ['./research-article.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResearchArticleComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initRevealAnimations();
        this.initStickyStackAnimations();
        this.initAnthropoStackAnimations();
        this.initCircularProgressAnimations();
        this.initCycleOrbitAnimations();
        ScrollTrigger.refresh();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }

  private initRevealAnimations(): void {
    gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  private initStickyStackAnimations(): void {
    const cards = gsap.utils.toArray<HTMLElement>('.sticky-card-ultra');
    if (!cards.length) return;

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      gsap.to(card, {
        scale: 0.90,
        opacity: 0.5,
        y: -10,
        filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: {
          trigger: cards[index + 1],
          start: 'top 90%',
          end: 'top 20%',
          scrub: true
        }
      });
    });
  }

  private initAnthropoStackAnimations(): void {
    const section = document.querySelector('.anthropometric-stack-section');
    if (!section) return;

    const cards = gsap.utils.toArray<HTMLElement>('.anthropo-stack-card');
    const dots = gsap.utils.toArray<HTMLElement>('.stack-dot');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.anthropometric-stack-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
        snap: {
          snapTo: [0, 0.5, 1], // Snaps perfectly to Card 1, Card 2, or Card 3
          duration: { min: 0.8, max: 1.5 },
          delay: 0.1,
          ease: 'power3.inOut'
        }
      }
    });

    // Setup: Card 1 is visible. Cards 2 and 3 are hidden below.
    gsap.set('.card-1', { transformOrigin: 'center center' });
    gsap.set('.card-2', { y: '100%', opacity: 1, transformOrigin: 'center center' });
    gsap.set('.card-3', { y: '100%', opacity: 1, transformOrigin: 'center center' });

    // Step 1: Card 1 fades and shrinks back, Card 2 slides up to cover it cleanly
    tl.to('.card-1', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, "step1")
      .to('.card-2', {
        y: '0%',
        duration: 1,
        ease: 'power2.inOut'
      }, "step1")
      .call(() => {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[1]) dots[1].classList.add('active');
      }, [], 0.5);

    // Step 2: Card 2 fades and shrinks back, Card 3 slides up to cover it cleanly
    tl.to('.card-2', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, "step2")
      .to('.card-3', {
        y: '0%',
        duration: 1,
        ease: 'power2.inOut'
      }, "step2")
      .call(() => {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[2]) dots[2].classList.add('active');
      }, [], 1.5);
  }

  private initCircularProgressAnimations(): void {
    const paths = document.querySelectorAll('.progress-path');
    paths.forEach(path => {
      const target = (path as HTMLElement).dataset['target'];
      const container = path.closest('.fact-item');
      const text = container?.querySelector('.progress-text');

      gsap.to(path, {
        strokeDasharray: target + ', 100',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      if (text) {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(target),
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            text.textContent = Math.round(counter.value) + '%';
          },
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }

  private initCycleOrbitAnimations(): void {
    const isDesktop = window.innerWidth > 991;
    if (!isDesktop) return; // Skip complex scroll orbit on mobile, let CSS handle stack

    const section = document.querySelector('.fly-through-section');
    const wrapper = document.querySelector('.fly-zoom-wrapper');
    const cards = gsap.utils.toArray<HTMLElement>('.fly-card');

    if (!section || !wrapper || !cards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5, // super smooth heavy scrubbing
        snap: {
          snapTo: [0, 1], // Snaps to fully scattered or fully assembled
          duration: { min: 0.8, max: 2 },
          delay: 0.1,
          ease: 'power3.inOut'
        }
      }
    });

    // Set cards far back in 3D space, scattered outward, and invisible
    cards.forEach((card, i) => {
      // Alternate starting positions to make them fly from all corners
      const randomX = (i % 2 === 0 ? -1 : 1) * gsap.utils.random(500, 1000);
      const randomY = (i < 3 ? -1 : 1) * gsap.utils.random(300, 800);

      gsap.set(card, {
        scale: 0.1,
        z: -1500,
        x: randomX,
        y: randomY,
        rotationZ: gsap.utils.random(-60, 60),
        rotationX: gsap.utils.random(-45, 45),
        rotationY: gsap.utils.random(-45, 45),
        opacity: 0
      });
    });

    // 1. Gently scale up the entire wrapper to give a feeling of flying INTO the scene
    tl.to(wrapper, {
      scale: 1.2,
      duration: 1,
      ease: 'none'
    }, 0);

    // 2. Pull all cards forward into their perfect absolute positions (joining together)
    tl.to(cards, {
      scale: 1,
      z: 0,
      x: 0,
      y: 0,
      rotationZ: 0,
      rotationX: 0,
      rotationY: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 1,
      ease: 'power3.out'
    }, 0);
  }
}



