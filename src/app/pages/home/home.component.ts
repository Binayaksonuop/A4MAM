import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser,
  NgOptimizedImage
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrls: [], // Using global styles from app.component.css
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // ─── State ────────────────────────────────────────
  private isBrowser: boolean;

  // Impact Stats
  childrenSupported = 0;
  nutritionImprovement = 0;
  communitiesReached = 0;

  // Chicky Bar Nutritional Metrics
  proteinDensity = 0;
  absorptionRate = 0;
  micronutrientLevel = 0;

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

  // WHO Reference Data (Weight-for-Age Median in kg)
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
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.animateHero();
        this.initGlobalScrollAnimations();
        ScrollTrigger.refresh();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }

  // ═══════════════════════════════════════════════════
  //  GSAP ANIMATIONS
  // ═══════════════════════════════════════════════════

  private animateHero(): void {
    const heroTargets = [
      '.hero-animate-1',
      '.hero-animate-2',
      '.hero-animate-3',
      '.hero-animate-4',
      '.hero-animate-5'
    ];

    gsap.set(heroTargets, { opacity: 0, y: 50 });
    gsap.set('.hero-floating-card', { opacity: 0, x: 100 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-animate-1', { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
      .to('.hero-animate-2', { opacity: 1, y: 0, duration: 1.4 }, '-=0.8')
      .to('.hero-animate-3', { opacity: 1, y: 0, duration: 1.2 }, '-=1')
      .to('.hero-animate-4', { opacity: 1, y: 0, duration: 1.2 }, '-=0.9')
      .to('.hero-animate-5', { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }, '-=1')
      .to('.hero-floating-card', { opacity: 1, x: 0, duration: 1.5, ease: 'expo.out' }, '-=1.2');

    gsap.from('.hero-bg-img', { scale: 1.2, duration: 10, ease: 'linear', repeat: -1, yoyo: true });
  }

  private initGlobalScrollAnimations(): void {
    this.initImpactAnimations();
    this.initRevealAnimations();
    this.initComparisonAnimations();
    this.initChickyBarAnimations();
    this.initStickyStackAnimations();
  }

  private initImpactAnimations(): void {
    const counter = { c: 0, n: 0, r: 0 };
    gsap.to(counter, {
      c: 1500, n: 92, r: 45,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#impact',
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        this.zone.run(() => {
          this.childrenSupported = Math.round(counter.c);
          this.nutritionImprovement = Math.round(counter.n);
          this.communitiesReached = Math.round(counter.r);
        });
      }
    });
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

  private initComparisonAnimations(): void {
    const dashboard = document.querySelector('.comparison-dashboard-3d');
    if (!dashboard) return;

    gsap.fromTo('.progress-bar-spirulina',
      { width: '0%' },
      {
        width: '85%',
        duration: 2.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: dashboard,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  private initChickyBarAnimations(): void {
    const section = document.querySelector('.chicky-bar-showcase-section');
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo('.chicky-product-frame-v2',
      { scale: 0.9, opacity: 0, rotateY: -15 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: 'expo.out' }
    )
      .fromTo('.chicky-data-tag-v2',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'back.out(1.7)' },
        '-=1'
      )
      .fromTo('.fact-ring-item-v2',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' },
        '-=0.8'
      );

    // Dynamic Rings & Counters
    const metrics = { p: 0, a: 0, m: 0 };
    gsap.to(metrics, {
      p: 85, a: 95, m: 70,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.nutritional-facts-premium-row',
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        this.zone.run(() => {
          this.proteinDensity = Math.round(metrics.p);
          this.absorptionRate = Math.round(metrics.a);
          this.micronutrientLevel = Math.round(metrics.m);
        });

        // Update SVG Dasharrays
        const rings = document.querySelectorAll('.progress-ring-bar');
        rings.forEach((ring: any) => {
          const target = ring.getAttribute('data-target');
          const currentVal = target === '85' ? metrics.p : (target === '95' ? metrics.a : metrics.m);
          ring.setAttribute('stroke-dasharray', `${currentVal}, 100`);
        });
      }
    });
  }

  private initStickyStackAnimations(): void {
    const cards = gsap.utils.toArray<HTMLElement>('.sticky-card-ultra');
    if (!cards.length) return;

    cards.forEach((card, index) => {
      // The last card doesn't need to shrink
      if (index === cards.length - 1) return;

      gsap.to(card, {
        scale: 0.92,
        opacity: 0.4,
        y: -30, // pushes it slightly up/back
        ease: 'none',
        scrollTrigger: {
          trigger: cards[index + 1],
          start: 'top 85%', // starts shrinking when the next card enters
          end: 'top 25%',   // finishes shrinking when the next card reaches its sticky position
          scrub: true
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════
  //  CALCULATOR LOGIC
  // ═══════════════════════════════════════════════════

  private getWhoMedian(ageMonths: number): number {
    const table = this.calcGender === 'female' ? this.whoMediansFemale : this.whoMediansMale;
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);

    if (ageMonths <= keys[0]) return table[keys[0]];
    if (ageMonths >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

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
    if (!this.calcAge || !this.calcWeight || this.calcAge < 6 || this.calcAge > 60 || this.calcWeight <= 0) {
      this.calcStatus = '';
      this.calcResultClass = '';
      this.calcZScore = null;
      return;
    }

    const median = this.getWhoMedian(this.calcAge);
    const sd = median * 0.12;
    const waz = (this.calcWeight - median) / sd;
    this.calcZScore = Math.round(waz * 10) / 10;

    if (waz >= -1) {
      this.calcStatus = 'Normal / Healthy';
      this.calcColor = '#10b981';
      this.calcIcon = 'bi-shield-check';
      this.calcDosageMg = '0.5g / day';
      this.calcRecommendation = 'Level 1 — Preventive Dose: 0.5g Spirulina daily via Chicky Bar to sustain nutritional immunity. Continue monthly MUAC screening.';
    } else if (waz >= -2) {
      this.calcStatus = 'At Risk';
      this.calcColor = '#06b6d4';
      this.calcIcon = 'bi-exclamation-circle';
      this.calcDosageMg = '1g / day';
      this.calcRecommendation = 'Level 1+ — Watchful Dose: 1g Spirulina daily. Monitor weight every 2 weeks. Increase nutrition via Chicky Bar.';
    } else if (waz >= -3) {
      this.calcStatus = 'Moderate Acute Malnutrition (MAM)';
      this.calcColor = '#f59e0b';
      this.calcIcon = 'bi-capsule';
      this.calcDosageMg = '2–3g / day';
      this.calcRecommendation = 'Level 2 — Therapeutic Dose: 2–3g Spirulina daily (1 Chicky Bar). Full 90-day structured recovery. Anganwadi enrollment required.';
    } else {
      this.calcStatus = 'Severe Acute Malnutrition (SAM)';
      this.calcColor = '#ef4444';
      this.calcIcon = 'bi-hospital';
      this.calcDosageMg = '5g / day';
      this.calcRecommendation = 'Level 3 — Intensive Protocol: 5g supervised Spirulina + RUTF. Immediate clinical referral. Emergency POSHAN enrollment + Chicky Bar 2x.';
    }
  }
}
