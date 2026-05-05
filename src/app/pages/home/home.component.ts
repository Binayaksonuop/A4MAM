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
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  childrenSupported = 0;
  nutritionImprovement = 0;
  communitiesReached = 0;

  proteinDensity = 0;
  absorptionRate = 0;
  micronutrientLevel = 0;

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

  private whoDataMale: Record<number, {m: number, s: number}> = {
    6: {m: 7.9, s: 0.8}, 9: {m: 8.9, s: 0.9}, 12: {m: 9.6, s: 1.0}, 15: {m: 10.3, s: 1.1}, 18: {m: 10.9, s: 1.2},
    21: {m: 11.5, s: 1.3}, 24: {m: 12.2, s: 1.4}, 30: {m: 13.3, s: 1.6}, 36: {m: 14.3, s: 1.8},
    42: {m: 15.3, s: 2.0}, 48: {m: 16.3, s: 2.2}, 54: {m: 17.3, s: 2.4}, 60: {m: 18.3, s: 2.6}
  };

  private whoDataFemale: Record<number, {m: number, s: number}> = {
    6: {m: 7.3, s: 0.8}, 9: {m: 8.2, s: 0.9}, 12: {m: 8.9, s: 1.0}, 15: {m: 9.6, s: 1.1}, 18: {m: 10.2, s: 1.2},
    21: {m: 10.9, s: 1.3}, 24: {m: 11.5, s: 1.4}, 30: {m: 12.7, s: 1.6}, 36: {m: 13.9, s: 1.8},
    42: {m: 15.0, s: 2.0}, 48: {m: 16.1, s: 2.2}, 54: {m: 17.2, s: 2.4}, 60: {m: 18.2, s: 2.6}
  };

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.animateHero();
        this.initRevealAnimations();
        this.initImpactAnimations();
        this.initComparisonAnimations();
        this.initChickyBarAnimations();
        this.initStackedCardAnimations();
        this.initJourneyAnimations();
        ScrollTrigger.refresh();
      }, 300);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private animateHero(): void {
    const heroTargets = [
      '.hero-reveal-1',
      '.hero-reveal-2',
      '.hero-reveal-3',
      '.hero-reveal-4',
      '.hero-reveal-5',
      '.floating-dashboard-v3'
    ];

    gsap.set(heroTargets, { opacity: 0, y: 50 });
    gsap.set(['.image-3d-wrapper-v3', '.hero-back-glow'], { opacity: 0, scale: 0.9 });
    gsap.set('.image-3d-wrapper-v3', { rotateY: -15 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });

    tl.to(heroTargets, {
      opacity: 1,
      y: 0,
      stagger: 0.18,
      delay: 0.4
    }, 0);

    tl.to(['.image-3d-wrapper-v3', '.hero-back-glow'], {
      opacity: 1,
      scale: 1,
      duration: 2.2,
      ease: 'expo.out'
    }, 0.6);

    tl.to('.image-3d-wrapper-v3', {
      rotateY: -12,
      duration: 2.2,
      ease: 'expo.out'
    }, 0.6);

    const heroBgImg = document.querySelector('.hero-bg-img');
    if (heroBgImg) {
      gsap.to(heroBgImg, {
        scale: 1.08,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }
  }

  private initRevealAnimations(): void {
    gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
      gsap.fromTo(
        el,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  private initImpactAnimations(): void {
    const impact = document.querySelector('#impact');
    if (!impact) return;

    const counter = { c: 0, n: 0, r: 0 };

    gsap.to(counter, {
      c: 1500,
      n: 92,
      r: 45,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#impact',
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        // Run zone only once every 2nd or 3rd frame, or just at the end if it's too much.
        // For counters, we need it to be reactive, so we run it, but outsideAngular helps.
        this.zone.run(() => {
          this.childrenSupported = Math.round(counter.c);
          this.nutritionImprovement = Math.round(counter.n);
          this.communitiesReached = Math.round(counter.r);
        });
      }
    });
  }

  private initComparisonAnimations(): void {
    const dashboard = document.querySelector('.comparison-dashboard-3d');
    if (!dashboard) return;

    gsap.fromTo(
      '.progress-bar-spirulina',
      { width: '0%' },
      {
        width: '65%',
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: dashboard,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  private initChickyBarAnimations(): void {
    const section = document.querySelector('.chicky-bar-showcase-section');
    if (!section) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        toggleActions: 'play none none reverse'
      }
    })
      .fromTo(
        '.chicky-product-frame',
        { scale: 0.92, opacity: 0, rotateY: -10 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 1.25, ease: 'expo.out' }
      )
      .fromTo(
        '.chicky-data-tag',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' },
        '-=0.75'
      )
      .fromTo(
        '.fact-item',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
        '-=0.5'
      );

    const metrics = { p: 0, a: 0, m: 0 };

    gsap.to(metrics, {
      p: 85,
      a: 95,
      m: 70,
      duration: 2.4,
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

        const pEl = document.getElementById('protein-val');
        const aEl = document.getElementById('absorption-val');
        const mEl = document.getElementById('micronutrient-val');

        if (pEl) pEl.textContent = Math.round(metrics.p) + '%';
        if (aEl) aEl.textContent = Math.round(metrics.a) + '%';
        if (mEl) mEl.textContent = Math.round(metrics.m) + '%';

        document.querySelectorAll<SVGPathElement>('.progress-ring-bar').forEach(ring => {
          const target = ring.getAttribute('data-target');
          if (target) {
            const current = target === '85' ? metrics.p : target === '95' ? metrics.a : metrics.m;
            ring.setAttribute('stroke-dasharray', `${current}, 100`);
          }
        });
      }
    });
  }

  private initStackedCardAnimations(): void {
    const stackItems = document.querySelectorAll('.stack-card-item');
    if (!stackItems.length) return;

    gsap.fromTo(stackItems,
      { y: 60, rotateX: -15, scale: 0.9, opacity: 0, transformOrigin: 'top center' },
      {
        y: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1.2, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.target-areas-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  private initJourneyAnimations(): void {
    const journeyItems = document.querySelectorAll('.journey-step-wrapper');
    if (!journeyItems.length) return;

    journeyItems.forEach((item, index) => {
      const tilt = index % 2 === 0 ? -12 : 12;
      
      gsap.fromTo(item.querySelector('.journey-node-card'),
        { opacity: 0, y: 40, rotateY: tilt, scale: 0.95 },
        {
          opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  private getWhoMetrics(ageMonths: number): { m: number, s: number } {
    const table = this.calcGender === 'female' ? this.whoDataFemale : this.whoDataMale;
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);

    if (ageMonths <= keys[0]) return table[keys[0]];
    if (ageMonths >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

    for (let i = 0; i < keys.length - 1; i++) {
      const low = keys[i];
      const high = keys[i + 1];

      if (ageMonths >= low && ageMonths <= high) {
        const t = (ageMonths - low) / (high - low);
        return {
          m: table[low].m + t * (table[high].m - table[low].m),
          s: table[low].s + t * (table[high].s - table[low].s)
        };
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

    const metrics = this.getWhoMetrics(this.calcAge);
    const waz = (this.calcWeight - metrics.m) / metrics.s;

    this.calcZScore = Math.round(waz * 100) / 100;
    this.calcResultClass = 'active';

    if (waz >= -1) {
      this.calcStatus = 'Normal / Healthy';
      this.calcColor = '#10b981';
      this.calcIcon = 'bi-shield-check';
      this.calcDosageMg = '1.0g / day';
      this.calcRecommendation = 'Maintain current nutrition. 1g daily Spirulina for preventive immunity support.';
    } else if (waz >= -2) {
      this.calcStatus = 'At Risk (Mildly Underweight)';
      this.calcColor = '#06b6d4';
      this.calcIcon = 'bi-exclamation-circle';
      this.calcDosageMg = '2.0g / day';
      this.calcRecommendation = 'Nutritional support needed. 2g daily Spirulina to prevent progression to MAM.';
    } else if (waz >= -3) {
      this.calcStatus = 'Moderate Acute Malnutrition (MAM)';
      this.calcColor = '#f59e0b';
      this.calcIcon = 'bi-exclamation-triangle';
      this.calcDosageMg = '3.0g - 5.0g / day';
      this.calcRecommendation = 'Therapeutic intervention required. High-dose Spirulina (Chicky Bars) plus balanced diet.';
    } else {
      this.calcStatus = 'Severe Acute Malnutrition (SAM)';
      this.calcColor = '#ef4444';
      this.calcIcon = 'bi-hospital';
      this.calcDosageMg = 'Immediate Clinical Action';
      this.calcRecommendation = 'CRITICAL: Requires immediate referral to a Nutrition Rehabilitation Center (NRC).';
    }
  }
}