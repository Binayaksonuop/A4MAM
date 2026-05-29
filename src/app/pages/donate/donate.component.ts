import { Component, OnInit, OnDestroy, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { DonationService, DonationPlan } from '../../services/donation.service';
import { Subscription } from 'rxjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, FormsModule],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  selectedTierId: string | null = null;
  customAmount: number | null = null;
  errorMessage: string | null = null;
  activePlans: DonationPlan[] = [];
  private subscription: Subscription | null = null;
  calcAmount: number = 1000;

  constructor(
    private cartService: CartService,
    private router: Router,
    private donationService: DonationService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.subscription = this.donationService.getPlans().subscribe(plans => {
      this.activePlans = plans.filter(p => p.active);
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      tl.from('.badge-donate-pill', { y: 20, opacity: 0, delay: 0.3 })
        .from('h1', { y: 30, opacity: 0 }, '-=0.7')
        .from('.lead', { y: 20, opacity: 0 }, '-=0.7')
        .from('.stat-item', { y: 30, opacity: 0, stagger: 0.1 }, '-=0.5')
        .from('.tier-card', { y: 40, opacity: 0, stagger: 0.15, duration: 1.2 }, '-=0.3');

      // Floating animation for featured card
      gsap.to('.tier-card.featured', {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });



      // STATS COUNT-UP
      const statNums = document.querySelectorAll('.stat-count-animate');
      statNums.forEach((el: any) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: '.impact-stats-bar', start: 'top 85%', once: true },
          onUpdate: () => { el.textContent = prefix + Math.round(obj.val).toLocaleString('en-IN') + suffix; }
        });
      });

      // FUND PROGRESS BAR animate on scroll
      gsap.fromTo('.fund-progress-fill',
        { width: '0%' },
        {
          width: '36.85%', duration: 2.5, ease: 'power3.out',
          scrollTrigger: { trigger: '.fund-progress-section', start: 'top 80%', once: true }
        }
      );

      // PROCESS CARDS scroll reveal
      gsap.utils.toArray('.process-card').forEach((card: any, i: number) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: i * 0.1,
            scrollTrigger: { trigger: '.how-it-works-section', start: 'top 80%', once: true }
          }
        );
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectTier(tierId: string) {
    this.selectedTierId = tierId;
    this.customAmount = null;
    this.errorMessage = '';
  }

  processTierDonation(plan: DonationPlan) {
    this.selectTier(plan.id);
    this.addToCartAndCheckout(plan.name, plan.amount);
  }

  processCustomDonation() {
    if (!this.customAmount || isNaN(this.customAmount) || this.customAmount < 100) {
      this.errorMessage = 'Please enter a valid numeric amount of at least ₹100.';
      return;
    }
    this.errorMessage = '';
    this.addToCartAndCheckout('Custom Contribution', this.customAmount);
  }

  trackByPlanId(index: number, plan: DonationPlan): string {
    return plan.id;
  }

  private addToCartAndCheckout(planName: string, amount: number) {
    this.cartService.addToCart({
      id: 'don-' + Date.now().toString(),
      name: planName,
      price: amount,
      quantity: 1,
      image: 'assets/images/impact_s.png',
      option: 'Donation'
    });
    this.router.navigate(['/checkout']);
  }

  get calcChildrenFed(): number {
    return Math.floor(this.calcAmount / 250);
  }

  get calcDaysOfNutrition(): number {
    return this.calcChildrenFed * 30;
  }

  get calcMealsProvided(): number {
    return this.calcChildrenFed;
  }

  get calcRecoveryPrograms(): string {
    return (this.calcAmount / 1500).toFixed(2);
  }

  scrollToTiers() {
    const tiersSection = document.querySelector('.donate-tiers-section');
    if (tiersSection) {
      tiersSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onCalcAmountChange(value: string) {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      this.calcAmount = Math.max(100, Math.min(50000, numValue));
    }
  }

  donateCalcAmount() {
    this.customAmount = this.calcAmount;
    this.processCustomDonation();
  }
}
