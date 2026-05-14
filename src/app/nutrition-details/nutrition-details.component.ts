import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-nutrition-details',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, FormsModule],
  templateUrl: './nutrition-details.component.html',
  styleUrl: './nutrition-details.component.css'
})
export class NutritionDetailsComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  // Calculator Variables
  calcGender: string = '';
  calcAge: number | null = null;
  calcWeight: number | null = null;
  calcStatus: string = '';
  calcColor: string = '#10b981';
  calcIcon: string = 'bi-shield-check';
  calcDosageMg: string = '';
  calcRecommendation: string = '';
  calcResultClass: string = '';
  calcZScore: number | null = null;

  // WHO Weight-for-Age (WAZ) metrics (simplified for 6-60 months)
  private whoWeightTable: { [key: number]: { m: number; s: number } } = {
    6: { m: 7.9, s: 0.9 },
    12: { m: 9.6, s: 1.0 },
    18: { m: 11.0, s: 1.1 },
    24: { m: 12.2, s: 1.2 },
    36: { m: 14.3, s: 1.4 },
    48: { m: 16.3, s: 1.6 },
    60: { m: 18.3, s: 1.8 }
  };

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

  private getWhoMetrics(ageMonths: number): { m: number; s: number } {
    const table = this.whoWeightTable;
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
    const age = Number(this.calcAge);
    const weight = Number(this.calcWeight);

    if (!age || !weight || age < 6 || age > 60 || weight <= 0) {
      this.calcStatus = '';
      this.calcResultClass = '';
      this.calcZScore = null;
      return;
    }

    const metrics = this.getWhoMetrics(age);
    const waz = (weight - metrics.m) / metrics.s;

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
