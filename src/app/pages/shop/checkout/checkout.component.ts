import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-page py-5 mt-5">
      <div class="checkout-mesh-bg"></div>

      <div class="container position-relative z-2">
        <div class="text-center mb-5">
          <span class="badge-premium-emerald mb-3 d-inline-block">Secure Transaction Gateway</span>
          <h1 class="display-4 fw-950 text-slate-900 mb-2">Finalize <span class="text-gradient-emerald">Order</span></h1>
          <p class="text-slate-500 fw-600">Secure distribution of nutritional interventions.</p>
        </div>

        <div class="row g-5">
          <!-- Left: Checkout Form -->
          <div class="col-lg-7">
            <div class="checkout-card-premium p-4 p-md-5 rounded-5 shadow-sm">
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="step-indicator">1</div>
                <h3 class="fw-950 text-slate-800 mb-0">Delivery Information</h3>
              </div>

              <form (submit)="placeOrder()">
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="premium-input-group">
                      <label class="form-label-premium">First Name</label>
                      <input type="text" name="firstName" class="form-control-premium" placeholder="Enter first name" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="premium-input-group">
                      <label class="form-label-premium">Last Name</label>
                      <input type="text" name="lastName" class="form-control-premium" placeholder="Enter last name" required>
                    </div>
                  </div>
                </div>

                <div class="premium-input-group mb-4">
                  <label class="form-label-premium">Email Address</label>
                  <div class="input-with-icon">
                    <i class="bi bi-envelope"></i>
                    <input type="email" name="email" class="form-control-premium" placeholder="your@email.com" required>
                  </div>
                </div>

                <div class="premium-input-group mb-4">
                  <label class="form-label-premium">Phone Number</label>
                  <div class="input-with-icon">
                    <i class="bi bi-phone"></i>
                    <input type="tel" name="phone" class="form-control-premium" placeholder="+91 00000 00000" required>
                  </div>
                </div>

                <div class="premium-input-group mb-4">
                  <label class="form-label-premium">Street Address</label>
                  <div class="input-with-icon">
                    <i class="bi bi-geo-alt"></i>
                    <input type="text" name="address" class="form-control-premium" placeholder="Flat, House no, Building, Street" required>
                  </div>
                </div>

                <div class="row g-3 mb-5">
                  <div class="col-md-6">
                    <div class="premium-input-group">
                      <label class="form-label-premium">City</label>
                      <input type="text" name="city" class="form-control-premium" placeholder="City" required>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="premium-input-group">
                      <label class="form-label-premium">State</label>
                      <input type="text" name="state" class="form-control-premium" placeholder="State" required>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="premium-input-group">
                      <label class="form-label-premium">PIN Code</label>
                      <input type="text" name="pinCode" class="form-control-premium" placeholder="PIN" required>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3 mb-4">
                  <div class="step-indicator">2</div>
                  <h3 class="fw-950 text-slate-800 mb-0">Payment Method</h3>
                </div>

                <div class="payment-selection-premium d-grid gap-3 mb-5">
                  <div class="payment-card cursor-pointer" 
                       [class.active]="paymentMethod === 'upi'"
                       (click)="paymentMethod = 'upi'">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center gap-3">
                        <div class="payment-icon-wrap">
                          <i class="bi bi-qr-code"></i>
                        </div>
                        <div>
                          <h6 class="fw-900 text-slate-800 mb-0">UPI Payment</h6>
                          <p class="x-small text-slate-400 mb-0">GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      <div class="custom-radio" [class.checked]="paymentMethod === 'upi'"></div>
                    </div>
                  </div>

                  <div class="payment-card cursor-pointer"
                       [class.active]="paymentMethod === 'cod'"
                       (click)="paymentMethod = 'cod'">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center gap-3">
                        <div class="payment-icon-wrap">
                          <i class="bi bi-cash-stack"></i>
                        </div>
                        <div>
                          <h6 class="fw-900 text-slate-800 mb-0">Cash on Delivery</h6>
                          <p class="x-small text-slate-400 mb-0">Pay upon clinical distribution</p>
                        </div>
                      </div>
                      <div class="custom-radio" [class.checked]="paymentMethod === 'cod'"></div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-confirm-ultra w-100 py-4 fw-950 rounded-pill fs-5" [disabled]="isProcessing">
                  <span *ngIf="!isProcessing">Confirm & Place Order <i class="bi bi-arrow-right-circle-fill ms-2"></i></span>
                  <span *ngIf="isProcessing">
                    <span class="spinner-border spinner-border-sm me-2"></span> Processing Order...
                  </span>
                </button>
              </form>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div class="col-lg-5">
            <div class="order-summary-card-premium p-5 rounded-5 sticky-top" style="top: 120px;">
              <h4 class="fw-950 text-slate-900 mb-4">Order <span class="text-emerald">Validation</span></h4>
              
              <div class="cart-preview-list-premium mb-4">
                <div class="preview-item-premium d-flex align-items-center gap-3 mb-3 p-3 rounded-4" *ngFor="let item of cartItems">
                  <div class="preview-img-container">
                    <img [src]="item.image" [alt]="item.name" class="img-fluid rounded-3">
                    <span class="qty-badge">{{ item.quantity }}</span>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="fw-900 text-slate-800 mb-0 fs-7">{{ item.name }}</h6>
                    <p class="text-slate-400 x-small mb-0">Premium Nutrition Grade</p>
                  </div>
                  <div class="fw-950 text-slate-900">₹{{ item.price * item.quantity }}</div>
                </div>
              </div>

              <div class="summary-details-premium pt-4 border-top border-slate-100">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-slate-500 fw-700">Subtotal</span>
                  <span class="text-slate-900 fw-950">₹{{ total }}</span>
                </div>
                <div class="d-flex justify-content-between mb-4">
                  <span class="text-slate-500 fw-700">Shipping</span>
                  <span class="text-emerald fw-950">FREE</span>
                </div>
                
                <div class="total-bar-premium p-4 rounded-4 mb-5 d-flex justify-content-between align-items-center">
                   <div>
                     <span class="x-small text-slate-400 d-block mb-1">FINAL TOTAL</span>
                     <h3 class="fw-950 text-slate-900 mb-0">₹{{ total }}</h3>
                   </div>
                   <div class="currency-badge">INR</div>
                </div>
              </div>

              <div class="impact-trust-premium-card p-4 rounded-5 text-center">
                <div class="heart-pulse-icon mx-auto mb-3">
                  <i class="bi bi-heart-fill"></i>
                </div>
                <h6 class="fw-950 text-slate-900 mb-2">Community Impact Factor</h6>
                <p class="small text-slate-500 mb-0 leading-tight">
                  This intervention supports <strong>{{ Math.floor(total / 25) }} days</strong> of recovery for a malnourished child.
                </p>
              </div>
              
              <div class="d-flex align-items-center justify-content-center gap-3 mt-4 opacity-40">
                <img src="https://img.icons8.com/color/48/visa.png" width="30" alt="Visa">
                <img src="https://img.icons8.com/color/48/mastercard.png" width="30" alt="Mastercard">
                <img src="https://img.icons8.com/color/48/google-pay.png" width="30" alt="GPay">
                <i class="bi bi-lock-fill fs-5"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { 
      background: #f8fafc; 
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .checkout-mesh-bg {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 500px;
      background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08), transparent 70%);
      pointer-events: none;
    }

    .badge-premium-emerald {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #059669;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ── Checkout Card ── */
    .checkout-card-premium {
      background: white;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    }

    .step-indicator {
      width: 32px;
      height: 32px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 950;
      font-size: 0.9rem;
    }

    /* ── Form Inputs ── */
    .premium-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-label-premium {
      font-size: 0.75rem;
      font-weight: 900;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-left: 5px;
    }
    .form-control-premium {
      background: #f8fafc;
      border: 2px solid transparent;
      border-radius: 16px;
      padding: 14px 20px;
      font-weight: 700;
      color: #1e293b;
      transition: all 0.3s ease;
    }
    .form-control-premium:focus {
      background: white;
      border-color: #10b981;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.08);
      outline: none;
    }

    .input-with-icon {
      position: relative;
    }
    .input-with-icon i {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 1.1rem;
    }
    .input-with-icon .form-control-premium {
      padding-left: 50px;
    }

    /* ── Payment Cards ── */
    .payment-card {
      background: #f8fafc;
      border: 2px solid transparent;
      border-radius: 20px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .payment-card:hover {
      background: white;
      border-color: #e2e8f0;
      transform: scale(1.02);
    }
    .payment-card.active {
      background: white;
      border-color: #10b981;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.1);
    }

    .payment-icon-wrap {
      width: 45px;
      height: 45px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #10b981;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .custom-radio {
      width: 24px;
      height: 24px;
      border: 2px solid #cbd5e1;
      border-radius: 50%;
      position: relative;
      transition: all 0.2s;
    }
    .custom-radio.checked {
      border-color: #10b981;
    }
    .custom-radio.checked::after {
      content: '';
      position: absolute;
      inset: 4px;
      background: #10b981;
      border-radius: 50%;
    }

    /* ── Order Summary ── */
    .order-summary-card-premium {
      background: white;
      box-shadow: 0 40px 100px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.03);
    }

    .preview-item-premium {
      background: #f8fafc;
      transition: all 0.2s;
    }
    .preview-item-premium:hover {
      background: #f1f5f9;
    }
    .preview-img-container {
      width: 60px;
      height: 60px;
      background: white;
      padding: 5px;
      position: relative;
    }
    .qty-badge {
      position: absolute;
      top: -10px; right: -10px;
      background: #1e293b;
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 0.65rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
    }

    .total-bar-premium {
      background: #1e293b;
      color: white;
    }
    .total-bar-premium h3, .total-bar-premium .x-small {
      color: white !important;
    }
    .currency-badge {
      font-weight: 900;
      font-size: 0.75rem;
      background: rgba(255,255,255,0.1);
      padding: 4px 10px;
      border-radius: 6px;
    }

    .impact-trust-premium-card {
      background: rgba(16, 185, 129, 0.05);
      border: 1px dashed #10b981;
    }
    .heart-pulse-icon {
      width: 50px;
      height: 50px;
      background: white;
      color: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
    }

    .btn-confirm-ultra {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .btn-confirm-ultra:hover:not(:disabled) {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
      color: white;
    }
    .btn-confirm-ultra:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .text-gradient-emerald {
      background: linear-gradient(90deg, #059669, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .fs-7 { font-size: 0.9rem; }
    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }
    .leading-tight { line-height: 1.3; }

    @media (max-width: 991px) {
      .order-summary-card-premium { margin-top: 40px; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  paymentMethod = 'upi';
  isProcessing = false;
  Math = Math;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
      if (this.total === 0) {
        this.router.navigate(['/shop']);
      }
    });
  }

  placeOrder(): void {
    this.isProcessing = true;
    // Simulate API call
    setTimeout(() => {
      const orderId = 'MAM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.cartService.clearCart();
      this.router.navigate(['/order-success'], { queryParams: { orderId: orderId, amount: this.total } });
    }, 2000);
  }
}
