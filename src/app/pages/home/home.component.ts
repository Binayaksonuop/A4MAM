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

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

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

    gsap.to('.hero-bg-img', {
      scale: 1.08,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
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
          const current = target === '85' ? metrics.p : target === '95' ? metrics.a : metrics.m;
          ring.setAttribute('stroke-dasharray', `${current}, 100`);
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

  private getWhoMedian(ageMonths: number): number {
    const table = this.calcGender === 'female' ? this.whoMediansFemale : this.whoMediansMale;
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);

    if (ageMonths <= keys[0]) return table[keys[0]];
    if (ageMonths >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

    for (let i = 0; i < keys.length - 1; i++) {
      const low = keys[i];
      const high = keys[i + 1];

      if (ageMonths >= low && ageMonths <= high) {
        const t = (ageMonths - low) / (high - low);
        return table[low] + t * (table[high] - table[low]);
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
      this.calcRecommendation = 'Preventive dose: continue balanced nutrition and monthly screening.';
    } else if (waz >= -2) {
      this.calcStatus = 'At Risk';
      this.calcColor = '#06b6d4';
      this.calcIcon = 'bi-exclamation-circle';
      this.calcDosageMg = '1g / day';
      this.calcRecommendation = 'Watchful dose: daily Spirulina support with regular follow-up screening.';
    } else if (waz >= -3) {
      this.calcStatus = 'Moderate Acute Malnutrition';
      this.calcColor = '#f59e0b';
      this.calcIcon = 'bi-exclamation-triangle';
      this.calcDosageMg = '2g / day';
      this.calcRecommendation = 'Therapeutic dose: supervised nutrition support with close monitoring.';
    } else {
      this.calcStatus = 'Severe Risk';
      this.calcColor = '#ef4444';
      this.calcIcon = 'bi-hospital';
      this.calcDosageMg = 'Clinical Review';
      this.calcRecommendation = 'Immediate clinical supervision is recommended.';
    }
  }
}