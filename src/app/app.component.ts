import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  NgZone
} from '@angular/core';
import {
  CommonModule,
  NgOptimizedImage,
  isPlatformBrowser
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  NavigationEnd,
  RouterModule
} from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // ─── State ────────────────────────────────────────
  isScrolled = false;
  showScrollTop = false;
  isHomePage = false;

  // Custom Cursor
  cursorX = -100;
  cursorY = -100;

  // Stats (counter animation targets)
  childrenSupported = 0;
  nutritionImprovement = 0;
  communitiesReached = 0;

  // Calculator State
  calcGender = 'male';
  calcAge: number | null = null;
  calcWeight: number | null = null;
  calcZScore: number | null = null;
  calcStatus = '';
  calcResultClass = '';
  calcColor = '';
  calcIcon = '';
  calcRecommendation = '';
  calcDosageMg = '';

  // Internal flags
  private statsAnimated = false;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  // ─── WHO Reference Data ───────────────────────────
  // WHO Median Weight-for-Age (kg) — simplified
  // sex-specific tables
  private whoMediansMale: Record<number, number> = {
    6: 7.9, 9: 8.9, 12: 9.6, 15: 10.3, 18: 10.9,
    21: 11.5, 24: 12.2, 30: 13.3, 36: 14.3,
    42: 15.3, 48: 16.3, 54: 17.3, 60: 18.3
  };

  private whoMediansFemale: Record<number, number> = {
    6: 7.3, 9: 8.2, 12: 8.9, 15: 9.6, 18: 10.2,
    21: 10.9, 24: 11.5, 30: 12.7, 36: 13.9,
    42: 15.0, 48: 16.1, 54: 17.2, 60: 18.2
  };

  constructor(
    private router: Router,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ═══════════════════════════════════════════════════
  //  LIFECYCLE HOOKS
  // ═══════════════════════════════════════════════════

  ngOnInit(): void {
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd =>
          event instanceof NavigationEnd
      ),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.isHomePage =
        url === '/' || url.startsWith('/#');

      if (!this.isBrowser) return;

      // Fragment scroll
      const fragment = url.split('#')[1];
      if (fragment) {
        setTimeout(() => {
          document
            .getElementById(fragment)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
        }, 300);
      }

      // Re-init hero animations on home
      if (this.isHomePage) {
        setTimeout(() => this.initHeroAnimations(), 500);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Small delay to ensure DOM is painted
    setTimeout(() => {
      this.initGlobalScrollAnimations();
      this.animateHero();
      ScrollTrigger.refresh();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up all GSAP ScrollTriggers
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }

  // ═══════════════════════════════════════════════════
  //  SCROLL & CURSOR LISTENERS
  // ═══════════════════════════════════════════════════

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 50;
    this.showScrollTop = scrollY > 500;
    this.updateScrollProgress();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser) return;
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
  }

  // ═══════════════════════════════════════════════════
  //  SCROLL UTILITIES
  // ═══════════════════════════════════════════════════

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateScrollProgress(): void {
    requestAnimationFrame(() => {
      const scrollTotal =
        document.documentElement.scrollHeight -
        window.innerHeight;
      if (scrollTotal <= 0) return;

      const CIRCUMFERENCE = 188.5; // 2 * PI * 30
      const progress =
        (window.scrollY / scrollTotal) * CIRCUMFERENCE;

      const circle = document.querySelector(
        '.circle-progress'
      ) as SVGCircleElement | null;

      if (circle) {
        circle.style.strokeDashoffset =
          (CIRCUMFERENCE - progress).toString();
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  HERO ANIMATIONS
  // ═══════════════════════════════════════════════════

  private animateHero(): void {
    if (!this.isBrowser) return;

    const elements = [
      '.hero-animate-1',
      '.hero-animate-2',
      '.hero-animate-3',
      '.hero-animate-4',
      '.hero-animate-5'
    ];

    // Only animate if elements exist
    const existing = elements.filter(
      sel => document.querySelector(sel)
    );
    if (existing.length === 0) return;

    gsap.set(existing, { opacity: 0, y: 50 });

    if (document.querySelector('.hero-floating-card')) {
      gsap.set('.hero-floating-card', {
        opacity: 0,
        x: 100
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' }
    });

    tl.to('.hero-animate-1', {
      opacity: 1, y: 0,
      duration: 1.2, delay: 0.5
    })
    .to('.hero-animate-2', {
      opacity: 1, y: 0, duration: 1.4
    }, '-=0.8')
    .to('.hero-animate-3', {
      opacity: 1, y: 0, duration: 1.2
    }, '-=1')
    .to('.hero-animate-4', {
      opacity: 1, y: 0, duration: 1.2
    }, '-=0.9')
    .to('.hero-animate-5', {
      opacity: 1, y: 0, duration: 1.2,
      stagger: 0.15
    }, '-=1');

    if (document.querySelector('.hero-floating-card')) {
      tl.to('.hero-floating-card', {
        opacity: 1, x: 0,
        duration: 1.5, ease: 'expo.out'
      }, '-=1.2');
    }

    // Background zoom
    if (document.querySelector('.hero-bg-img')) {
      gsap.from('.hero-bg-img', {
        scale: 1.2, duration: 5,
        ease: 'power2.out'
      });
    }
  }

  private initHeroAnimations(): void {
    if (
      !this.isBrowser ||
      !document.querySelector('.hero-animate-1')
    ) return;

    const heroTargets = [
      '.hero-animate-1',
      '.hero-animate-2',
      '.hero-animate-3'
    ];

    gsap.set(heroTargets, { y: 40, opacity: 0 });
    gsap.set('.hero-animate-4 .btn', {
      y: 40, opacity: 0
    });
    gsap.set('.hero-animate-5 .hero-stat-item', {
      y: 40, opacity: 0
    });
    gsap.set('.hero-floating-card', {
      x: 80, opacity: 0, scale: 0.9
    });
    gsap.set('.hero-deco-node', {
      scale: 0, opacity: 0
    });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' }
    });

    tl.to('.hero-animate-1', {
      y: 0, opacity: 1, duration: 1.4
    })
    .to('.hero-animate-2', {
      y: 0, opacity: 1, duration: 1.6
    }, '-=1.2')
    .to('.hero-animate-3', {
      y: 0, opacity: 1, duration: 1.4
    }, '-=1.3')
    .to('.hero-animate-4 .btn', {
      y: 0, opacity: 1, duration: 1.2,
      stagger: 0.15
    }, '-=1.1')
    .to('.hero-animate-5 .hero-stat-item', {
      y: 0, opacity: 1, duration: 1,
      stagger: 0.12
    }, '-=0.9')
    .to('.hero-floating-card', {
      x: 0, opacity: 1, scale: 1,
      duration: 2, ease: 'power4.out'
    }, '-=1.8')
    .to('.hero-deco-node', {
      scale: 1, opacity: 0.6, duration: 1.5,
      stagger: 0.3, ease: 'back.out(2)'
    }, '-=1.5');
  }

  // ═══════════════════════════════════════════════════
  //  GLOBAL SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════════

  private initGlobalScrollAnimations(): void {
    if (!this.isBrowser) return;

    // ── Scroll Progress Bar ──
    const scrollProgressEl =
      document.querySelector('.scroll-progress');
    if (scrollProgressEl) {
      gsap.to(scrollProgressEl, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5
        }
      });
    }

    // ── Data Bars ──
    document
      .querySelectorAll<HTMLElement>('.data-bar-fill')
      .forEach(bar => {
        const targetWidth = bar.style.width;
        gsap.set(bar, { width: 0 });
        gsap.to(bar, {
          width: targetWidth,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        });
      });

    // ── Foundation Section ──
    this.initFoundationAnimations();

    // ── Workflow Timeline ──
    this.initWorkflowAnimations();

    // ── Impact Section (Counter + Parallax) ──
    this.initImpactAnimations();

    // ── Global Reveal ──
    this.initRevealAnimations();

    // ── Spirulina Section ──
    setTimeout(() => {
      this.initSpirulinaAnimations();
      ScrollTrigger.refresh();
    }, 1200);
  }

  private initFoundationAnimations(): void {
    const section =
      document.querySelector('#nutrition-foundation');
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(
      '.image-stack-premium',
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
    )
    .fromTo(
      '.foundation-content-wrapper > *',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2,
        stagger: 0.2, ease: 'power4.out'
      },
      '-=1.2'
    )
    .fromTo(
      '.foundation-block-item',
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1,
        stagger: 0.2, ease: 'back.out(1.2)'
      },
      '-=1'
    );
  }

  private initWorkflowAnimations(): void {
    const timelineRow =
      document.querySelector('.timeline-row');
    if (!timelineRow) return;

    gsap.fromTo(
      '.timeline-step-item',
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.5,
        stagger: 0.2, ease: 'expo.out',
        scrollTrigger: {
          trigger: timelineRow,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      '.timeline-main-line',
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: timelineRow,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  private initImpactAnimations(): void {
    const impactSection =
      document.querySelector('#impact');
    if (!impactSection) return;

    // Counter animation
    const counter = { c: 0, n: 0, r: 0 };
    gsap.to(counter, {
      c: 1500,
      n: 92,
      r: 45,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: impactSection,
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        this.zone.run(() => {
          this.childrenSupported =
            Math.round(counter.c);
          this.nutritionImprovement =
            Math.round(counter.n);
          this.communitiesReached =
            Math.round(counter.r);
        });
      }
    });

    // Background parallax
    const impactBg = document.querySelector(
      '.impact-bg-overlay-light'
    );
    if (impactBg) {
      gsap.to(impactBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: impactSection,
          scrub: 1
        }
      });
    }
  }

  private initRevealAnimations(): void {
    const reveals =
      gsap.utils.toArray<HTMLElement>('.gsap-reveal');
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

  private initSpirulinaAnimations(): void {
    const section = document.querySelector(
      '.spirulina-info-section-ultra-v2'
    );
    if (!section) return;

    const revealTargets = [
      '.spirulina-reveal-1',
      '.spirulina-reveal-2',
      '.spirulina-reveal-3'
    ];

    gsap.set(revealTargets, { y: 30, opacity: 0 });
    gsap.set('.feature-item-v2', {
      x: -30, opacity: 0
    });
    gsap.set('.spirulina-card-inner-v2', {
      scale: 0.85, opacity: 0, rotateY: -20
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to('.spirulina-reveal-1', {
      y: 0, opacity: 1, duration: 1
    })
    .to('.spirulina-reveal-2', {
      y: 0, opacity: 1, duration: 1.2
    }, '-=1')
    .to('.spirulina-reveal-3', {
      y: 0, opacity: 1, duration: 1
    }, '-=1')
    .to('.feature-item-v2', {
      x: 0, opacity: 1, duration: 1,
      stagger: 0.15, ease: 'power4.out'
    }, '-=0.8')
    .to('.spirulina-card-inner-v2', {
      scale: 1, opacity: 1, rotateY: 0,
      duration: 2, ease: 'expo.out'
    }, '-=1.5');

    // Card parallax
    gsap.to('.spirulina-card-inner-v2', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        scrub: 1.5
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  CLINICAL CALCULATOR
  // ═══════════════════════════════════════════════════

  private getWhoMedian(ageMonths: number): number {
    const table = this.calcGender === 'female'
      ? this.whoMediansFemale
      : this.whoMediansMale;

    const keys = Object.keys(table)
      .map(Number)
      .sort((a, b) => a - b);

    // Clamp to range
    if (ageMonths <= keys[0]) return table[keys[0]];
    if (ageMonths >= keys[keys.length - 1]) {
      return table[keys[keys.length - 1]];
    }

    // Linear interpolation
    for (let i = 0; i < keys.length - 1; i++) {
      const lo = keys[i];
      const hi = keys[i + 1];
      if (ageMonths >= lo && ageMonths <= hi) {
        const t = (ageMonths - lo) / (hi - lo);
        return table[lo] + t * (table[hi] - table[lo]);
      }
    }

    return table[keys[keys.length - 1]];
  }

  calculateDosage(): void {
    // Reset on invalid input
    if (
      !this.calcAge ||
      !this.calcWeight ||
      this.calcAge < 6 ||
      this.calcAge > 60 ||
      this.calcWeight <= 0
    ) {
      this.calcStatus = '';
      this.calcResultClass = '';
      this.calcZScore = null;
      this.calcDosageMg = '';
      this.calcRecommendation = '';
      return;
    }

    const median = this.getWhoMedian(this.calcAge);
    const sd = median * 0.12; // ~12% SD approximation
    const waz = (this.calcWeight - median) / sd;

    this.calcZScore = Math.round(waz * 10) / 10;

    if (waz >= -1) {
      this.calcStatus = 'Normal / Healthy';
      this.calcColor = '#10b981';
      this.calcIcon = 'bi-shield-check';
      this.calcResultClass = 'status-normal';
      this.calcDosageMg = '0.5g / day';
      this.calcRecommendation =
        'Level 1 — Preventive Dose: 0.5g Spirulina ' +
        'daily via Chicky Bar to sustain nutritional ' +
        'immunity. Continue monthly MUAC screening.';
    } else if (waz >= -2) {
      this.calcStatus = 'At Risk';
      this.calcColor = '#06b6d4';
      this.calcIcon = 'bi-exclamation-circle';
      this.calcResultClass = 'status-normal';
      this.calcDosageMg = '1g / day';
      this.calcRecommendation =
        'Level 1+ — Watchful Dose: 1g Spirulina ' +
        'daily. Monitor weight every 2 weeks. ' +
        'Increase nutrition via Chicky Bar.';
    } else if (waz >= -3) {
      this.calcStatus =
        'Moderate Acute Malnutrition (MAM)';
      this.calcColor = '#f59e0b';
      this.calcIcon = 'bi-capsule';
      this.calcResultClass = 'status-moderate';
      this.calcDosageMg = '2–3g / day';
      this.calcRecommendation =
        'Level 2 — Therapeutic Dose: 2–3g Spirulina ' +
        'daily (1 Chicky Bar). Full 90-day structured ' +
        'recovery. Anganwadi enrollment required.';
    } else {
      this.calcStatus =
        'Severe Acute Malnutrition (SAM)';
      this.calcColor = '#ef4444';
      this.calcIcon = 'bi-hospital';
      this.calcResultClass = 'status-severe';
      this.calcDosageMg = '5g / day';
      this.calcRecommendation =
        'Level 3 — Intensive Protocol: 5g supervised ' +
        'Spirulina + RUTF. Immediate clinical referral. ' +
        'Emergency POSHAN enrollment + Chicky Bar 2x.';
    }
  }

  // ═══════════════════════════════════════════════════
  //  NAVBAR UTILITIES
  // ═══════════════════════════════════════════════════

  closeNavbar(): void {
    if (!this.isBrowser) return;

    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      const toggler = document.querySelector(
        '.navbar-toggler'
      ) as HTMLElement | null;
      toggler?.click();
    }

    // Close any open dropdowns
    document
      .querySelectorAll('.dropdown-menu.show')
      .forEach(d => d.classList.remove('show'));
  }
}
