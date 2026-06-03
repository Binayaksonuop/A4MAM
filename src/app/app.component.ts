import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule, isPlatformBrowser, } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  RouterModule
} from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartService } from './services/cart.service';
import { LightboxService } from './services/lightbox.service';
import { AnalyticsService } from './services/analytics.service';
import { LoaderService } from './services/loader.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  // ─── State ────────────────────────────────────────
  isScrolled = false;
  showScrollTop = false;
  isHomePage = false;
  isAdminPage = false;
  isAdminDashboard = false;
  isLoading = true;

  get cartCount(): number {
    return this.cartService.cartCount();
  }

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

  // Lightbox
  lightboxData$: Observable<any>;

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
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private lightboxService: LightboxService,
    private analyticsService: AnalyticsService,
    private loaderService: LoaderService,
    public globalSettings: GlobalSettingsService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.lightboxData$ = this.lightboxService.lightboxData$;
  }

  // ═══════════════════════════════════════════════════
  //  LIFECYCLE HOOKS
  // ═══════════════════════════════════════════════════

  ngOnInit(): void {
    if (this.isBrowser) {
      this.analyticsService.init();
      this.globalSettings.loadSettings();
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hide initial loader after delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    
    // Immediate initial check for SSR and first load
    this.isAdminPage = this.router.url.startsWith('/admin');
    this.isAdminDashboard = this.router.url.startsWith('/admin/dashboard');

    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isHomePage =
          url === '/' || url.startsWith('/#');

        this.isAdminPage = url.startsWith('/admin');
        this.isAdminDashboard = url.startsWith('/admin/dashboard');

        if (this.isBrowser) {
          this.analyticsService.trackPageView(url);

          // Smooth scroll to top on route change (no fragment)
          const fragment = url.split('#')[1];
          if (!fragment) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            // Fragment scroll
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
            this.updateMetaTags('Home');
            setTimeout(() => this.initHeroAnimations(), 500);
          } else {
            this.updateMetaTags(url.split('/')[1]);
            setTimeout(() => {
              this.initRevealAnimations();
              ScrollTrigger.refresh();
            }, 500);
          }
        }

        // Hide loader after a short delay (minimum 800ms for cinematic feel)
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    });
  }

  private updateMetaTags(page: string): void {
    let description = '';
    switch (page.toLowerCase()) {
      case 'home':
      case '':
        description = 'MAM - Mission Against Malnutrition. Using Spirulina superfoods to fight malnutrition and heal 1500+ children in India.';
        break;
      case 'about':
        description = 'Learn about our biological intervention mission, Spirulina bioavailability, and how we are rewriting the code of human potential.';
        break;
      case 'contact':
        description = 'Get in touch with A4MAM. Partner with us, volunteer, or reach out to our offices in Hyderabad and Bhubaneswar.';
        break;
      case 'donate':
        description = 'Support our mission. Every contribution heals a life. 80G Tax Exemption available for all donations.';
        break;
      default:
        description = 'MAM - Mission Against Malnutrition. Join the biological crusade against global hunger.';
    }
    this.meta.updateTag({ name: 'description', content: description });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Small delay to ensure DOM is painted
    setTimeout(() => {
      this.initGlobalScrollAnimations();
      this.animateHero();
      this.initCustomCursor();
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
    // We handle the cursor via GSAP quickSetter in initCustomCursor for performance
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
      const doc = document.documentElement;
      const body = document.body;

      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = Math.max(
        body.scrollHeight, doc.scrollHeight,
        body.offsetHeight, doc.offsetHeight,
        body.clientHeight, doc.clientHeight
      );
      const clientHeight = doc.clientHeight;
      const scrollTotal = scrollHeight - clientHeight;

      if (scrollTotal <= 0) return;

      const CIRCUMFERENCE = 188.5;
      const progressRatio = scrollTop / scrollTotal;

      const circle = document.querySelector('.circle-progress') as SVGCircleElement | null;

      if (circle) {
        // If we are within 2% of the bottom, snap to 100% completion
        if (progressRatio > 0.98) {
          circle.style.strokeDashoffset = '0';
        } else {
          const progress = progressRatio * CIRCUMFERENCE;
          // Use Math.max(0.1, ...) to ensure it doesn't look weird at the very start
          // and sub-pixel rounding doesn't cause issues
          const offset = Math.max(0, CIRCUMFERENCE - progress);
          circle.style.strokeDashoffset = offset.toFixed(2);
        }
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

    const floatingCard = document.querySelector('.hero-floating-card');
    if (floatingCard) {
      gsap.set(floatingCard, {
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

    if (floatingCard) {
      tl.to(floatingCard, {
        opacity: 1, x: 0,
        duration: 1.5, ease: 'expo.out'
      }, '-=1.2');
    }

    // Background zoom
    const heroBgImg = document.querySelector('.hero-bg-img');
    if (heroBgImg) {
      gsap.from(heroBgImg, {
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
  //  PREMIUM CUSTOM CURSOR (GSAP)
  // ═══════════════════════════════════════════════════

  private initCustomCursor(): void {
    if (!this.isBrowser) return;

    const dot = document.querySelector('.cursor-dot') as HTMLElement;
    const outline = document.querySelector('.cursor-outline') as HTMLElement;

    if (!dot || !outline) return;

    // Set initial positions
    gsap.set(dot, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    gsap.set(outline, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    // Use GSAP quickSetter for ultra-performance (no frame drops)
    const xDotSetter = gsap.quickSetter(dot, "x", "px");
    const yDotSetter = gsap.quickSetter(dot, "y", "px");

    const xOutlineSetter = gsap.quickSetter(outline, "x", "px");
    const yOutlineSetter = gsap.quickSetter(outline, "y", "px");

    window.addEventListener("mousemove", (e) => {
      // Immediate follow for the dot
      xDotSetter(e.clientX);
      yDotSetter(e.clientY);

      // Smooth inertia follow for the outline
      gsap.to(outline, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    });

    // Add Hover Effects for all interactive elements
    const hoverTargets = 'a, button, .cursor-pointer, .btn, .nav-link, input, textarea';

    const addHover = () => {
      document.body.classList.add('cursor-active');
    };

    const removeHover = () => {
      document.body.classList.remove('cursor-active');
    };

    // Initial attach
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    // Handle dynamic content (re-attach listeners when navigating)
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          document.querySelectorAll(hoverTargets).forEach(el => {
            el.removeEventListener('mouseenter', addHover);
            el.removeEventListener('mouseleave', removeHover);
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
          });
        }, 1000);
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  GLOBAL SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════════

  private initGlobalScrollAnimations(): void {
    if (!this.isBrowser) return;

    // ── Scroll Progress Bar ──
    const scrollProgressEl = document.querySelector('.scroll-progress');
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

    ScrollTrigger.refresh();
  }

  private initRevealAnimations(): void {
    if (!this.isBrowser) return;
    const reveals = gsap.utils.toArray<HTMLElement>('.gsap-reveal');
    reveals.forEach((el: HTMLElement) => {
      gsap.fromTo(el,
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
    const nav = document.getElementById('navbarNav');
    if (nav && nav.classList.contains('show')) {
      const bsCollapse = (window as any).bootstrap?.Collapse.getInstance(nav);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        // Fallback if bootstrap is not available or instance not found
        const toggler = document.querySelector('.navbar-toggler') as HTMLElement | null;
        toggler?.click();
      }
    }

    // Close any open dropdowns
    document.querySelectorAll('.dropdown-menu.show').forEach(d => d.classList.remove('show'));
  }

  // ═══════════════════════════════════════════════════
  //  LIGHTBOX ACTIONS
  // ═══════════════════════════════════════════════════

  closeLightbox(): void {
    this.lightboxService.close();
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    this.lightboxService.next();
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    this.lightboxService.prev();
  }
}

