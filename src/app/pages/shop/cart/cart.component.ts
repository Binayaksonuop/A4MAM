import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page py-5 mt-5">
      <div class="cart-mesh-bg"></div>
      
      <div class="container position-relative z-2">
        <div class="text-center mb-5">
          <span class="badge-premium-emerald mb-3 d-inline-block">Scientific Nutrition Distribution</span>
          <h1 class="display-4 fw-950 text-slate-900 mb-2">Your Nutrition <span class="text-gradient-emerald">Cart</span></h1>
          <p class="text-slate-500 fw-600">Review your selected interventions for community impact.</p>
        </div>

        <div class="row g-5" *ngIf="(cartItems$ | async) as items">
          <!-- Items List -->
          <div class="col-lg-8" *ngIf="items.length > 0; else emptyCart">
            <div class="cart-items-list">
              <div class="cart-item-card-premium p-4 rounded-5 mb-4" *ngFor="let item of items">
                <div class="row align-items-center">
                  <div class="col-3 col-md-2">
                    <div class="item-img-container">
                      <img [src]="item.image" [alt]="item.name" class="img-fluid rounded-4">
                    </div>
                  </div>
                  <div class="col-9 col-md-5">
                    <div class="d-flex align-items-center gap-2 mb-1">
                       <span class="product-type-tag">PREMIUM GRADE</span>
                    </div>
                    <h4 class="fw-900 text-slate-800 mb-1">{{ item.name }}</h4>
                    <p class="text-muted small mb-2" *ngIf="item.option">Option: {{ item.option }}</p>
                    <p class="text-emerald fw-800 fs-5 mb-0">₹{{ item.price }}</p>
                  </div>
                  <div class="col-6 col-md-3 mt-3 mt-md-0">
                    <div class="quantity-control-premium d-flex align-items-center justify-content-between rounded-pill px-3 py-2">
                      <button class="btn-qty" (click)="updateQty(item, -1)"><i class="bi bi-dash-lg"></i></button>
                      <span class="fw-950 fs-5 text-slate-800">{{ item.quantity }}</span>
                      <button class="btn-qty" (click)="updateQty(item, 1)"><i class="bi bi-plus-lg"></i></button>
                    </div>
                  </div>
                  <div class="col-6 col-md-2 text-end mt-3 mt-md-0">
                    <div class="item-total-wrap">
                      <span class="text-slate-400 x-small d-block mb-1">SUBTOTAL</span>
                      <h4 class="fw-950 text-slate-900 mb-2">₹{{ item.price * item.quantity }}</h4>
                      <button class="btn-remove-premium" (click)="removeItem(item)">
                        <i class="bi bi-trash3-fill me-1"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="col-lg-4" *ngIf="items.length > 0">
            <div class="summary-card-ultra p-5 rounded-5 shadow-2xl sticky-top" style="top: 120px;">
              <h3 class="fw-950 text-slate-900 mb-4">Order <span class="text-emerald">Summary</span></h3>
              
              <div class="summary-row d-flex justify-content-between mb-3">
                <span class="text-slate-500 fw-700">Subtotal</span>
                <span class="text-slate-800 fw-900">₹{{ subtotal }}</span>
              </div>
              <div class="summary-row d-flex justify-content-between mb-3">
                <span class="text-slate-500 fw-700">Shipping</span>
                <span class="text-emerald fw-900">FREE</span>
              </div>
              <div class="summary-row d-flex justify-content-between mb-4">
                <span class="text-slate-500 fw-700">Taxes</span>
                <span class="text-slate-800 fw-900">₹0.00</span>
              </div>
              
              <div class="total-divider my-4"></div>
              
              <div class="d-flex justify-content-between align-items-end mb-5">
                <div>
                  <span class="text-slate-400 x-small d-block mb-1">TOTAL AMOUNT</span>
                  <h2 class="fw-950 text-slate-900 mb-0">₹{{ subtotal }}</h2>
                </div>
                <div class="currency-tag">INR</div>
              </div>
              
              <div class="impact-card-mini p-4 rounded-4 mb-5">
                <div class="d-flex gap-3">
                  <div class="impact-icon-circle">
                    <i class="bi bi-heart-pulse-fill"></i>
                  </div>
                  <div>
                    <h6 class="fw-900 mb-1 text-slate-800">Health Impact</h6>
                    <p class="small mb-0 text-slate-500 leading-tight">
                      This order provides approximately <strong>{{ Math.floor(subtotal / 25) }} days</strong> of nutritional support to a child.
                    </p>
                  </div>
                </div>
              </div>

              <a routerLink="/checkout" class="btn btn-checkout-ultra w-100 py-4 fw-950 rounded-pill fs-5 shadow-lg">
                Proceed to Checkout <i class="bi bi-arrow-right-circle-fill ms-2"></i>
              </a>
              
              <div class="d-flex align-items-center justify-content-center gap-2 mt-4 opacity-50">
                <i class="bi bi-shield-check text-emerald fs-5"></i>
                <span class="small fw-800 letter-spacing-1">SECURE ENCRYPTED CHECKOUT</span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="empty-cart-state text-center py-5">
            <div class="empty-cart-icon-wrap mb-4 mx-auto">
              <i class="bi bi-cart-x"></i>
              <div class="icon-pulse"></div>
            </div>
            <h2 class="fw-950 text-slate-800 mb-3">Your Cart is Currently Empty</h2>
            <p class="text-slate-500 mb-5 mx-auto" style="max-width: 400px;">
              You haven't selected any nutritional interventions yet. 
              Help us fight malnutrition by exploring our products.
            </p>
            <a routerLink="/shop" class="btn btn-emerald-lg px-5 py-3 fw-900 rounded-pill hover-scale">
              <i class="bi bi-bag-plus-fill me-2"></i> Start Shopping
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { 
      background: #f8fafc; 
      min-height: 100vh; 
      position: relative;
      overflow: hidden;
    }

    .cart-mesh-bg {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 600px;
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

    /* ── Item Cards ── */
    .cart-item-card-premium {
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.03);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .cart-item-card-premium:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }

    .item-img-container {
      background: #f1f5f9;
      padding: 10px;
      border-radius: 20px;
    }

    .product-type-tag {
      font-size: 0.6rem;
      font-weight: 900;
      color: #94a3b8;
      letter-spacing: 1px;
    }

    /* ── Controls ── */
    .quantity-control-premium {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      width: fit-content;
    }
    .btn-qty {
      background: none;
      border: none;
      color: #64748b;
      padding: 4px 10px;
      transition: all 0.2s;
    }
    .btn-qty:hover {
      color: #10b981;
      transform: scale(1.2);
    }

    .btn-remove-premium {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0;
      transition: all 0.2s;
      opacity: 0.6;
    }
    .btn-remove-premium:hover {
      opacity: 1;
      text-decoration: underline;
    }

    /* ── Summary Card ── */
    .summary-card-ultra {
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.05);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.08);
    }
    .total-divider {
      height: 1px;
      background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
    }
    .currency-tag {
      font-weight: 900;
      color: #94a3b8;
      font-size: 0.75rem;
      padding-bottom: 5px;
    }

    .impact-card-mini {
      background: rgba(16, 185, 129, 0.04);
      border-left: 4px solid #10b981;
    }
    .impact-icon-circle {
      width: 40px;
      height: 40px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .btn-checkout-ultra {
      background: #10b981;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .btn-checkout-ultra:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3) !important;
      color: white;
    }

    /* ── Empty State ── */
    .empty-cart-icon-wrap {
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      color: #e2e8f0;
      position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }
    .icon-pulse {
      position: absolute;
      inset: 0;
      border: 2px solid #10b981;
      border-radius: 50%;
      animation: ripple 2s infinite;
      opacity: 0;
    }

    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    .text-gradient-emerald {
      background: linear-gradient(90deg, #059669, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }
    .hover-scale:hover { transform: scale(1.05); }
    .leading-tight { line-height: 1.3; }

    @media (max-width: 991px) {
      .summary-card-ultra { margin-top: 40px; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  subtotal = 0;
  Math = Math;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(() => {
      this.subtotal = this.cartService.getCartTotal();
    });
  }

  updateQty(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.id, item.quantity + delta, item.option);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.option);
  }
}
