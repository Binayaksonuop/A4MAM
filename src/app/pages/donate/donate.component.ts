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
export class DonateComponent implements OnInit, OnDestroy {
  selectedTierId: string = '';
  customAmount: number | null = null;
  errorMessage: string = '';
  activePlans: DonationPlan[] = [];
  private subscription: Subscription | null = null;

  constructor(
    private cartService: CartService, 
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit() {
    this.subscription = this.donationService.getPlans().subscribe(plans => {
      this.activePlans = plans.filter(p => p.active);
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
