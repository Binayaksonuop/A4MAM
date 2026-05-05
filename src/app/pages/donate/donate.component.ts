import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { DonationService, DonationPlan } from '../../services/donation.service';
import { Subscription } from 'rxjs';

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
}
