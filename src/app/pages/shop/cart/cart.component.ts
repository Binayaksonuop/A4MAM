import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { Observable } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-obsidian-v6">
      <!-- Cinematic Background System -->
      <div class="aura-container">
        <div class="aura-orb aura-emerald"></div>
        <div class="aura-orb aura-navy"></div>
        <div class="aura-orb aura-violet"></div>
      </div>
      <div class="tech-grid-overlay"></div>
      <div class="bg-noise"></div>

      <div class="container position-relative z-3 py-100">
        
        <!-- Premium Header -->
        <div class="mb-5 reveal-v6 text-center text-lg-start">
          <div class="glass-chip-v6 mb-3">
            <span class="pulse-dot-v6"></span> IMPACT TRACKER v1.0
          </div>
          <h1 class="display-2 fw-950 text-white mb-2 tracking-tighter">
            Your Contribution <span class="text-gradient-mixed-v6">Impact</span>
          </h1>
          <p class="text-white text-opacity-60 fs-5 fw-500">Transforming local communities through clinical-grade nutrition.</p>
        </div>

        <div class="row g-5" *ngIf="(cartItems$ | async) as items">
          
          <!-- ITEMS LIST -->
          <div class="col-lg-8" *ngIf="items.length > 0; else emptyCart">
            <div class="cart-items-grid-v6">
              <div class="cart-item-glass-v6 p-4 mb-4 reveal-v6" *ngFor="let item of items">
                <div class="row align-items-center g-4">
                  <div class="col-4 col-md-2">
                    <div class="item-img-wrap-v6">
                      <img [src]="item.image" [alt]="item.name" class="img-fluid" onerror="this.src='assets/images/logo_mam.png'">
                    </div>
                  </div>
                  
                  <div class="col-8 col-md-5">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <span class="badge-v6">PREMIUM GRADE</span>
                      <span class="badge-v6 emerald">BIO-AVAILABLE</span>
                    </div>
                    <h3 class="fw-950 text-white mb-1 letter-spacing-neg-1">{{ item.name }}</h3>
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-white text-opacity-40 x-small text-uppercase">Price per unit:</span>
                      <span class="text-emerald fw-900">₹{{ item.price }}</span>
                    </div>
                  </div>

                  <div class="col-6 col-md-3">
                    <div class="qty-stepper-v6">
                      <button (click)="updateQty(item, -1)" [disabled]="item.quantity <= 1">
                        <i class="bi bi-dash"></i>
                      </button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQty(item, 1)">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div class="col-6 col-md-2 text-end">
                    <div class="item-total-v6 mb-2">₹{{ item.price * item.quantity }}</div>
                    <button class="btn-remove-v6" (click)="removeItem(item)">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- MISSION SUMMARY PANEL -->
          <div class="col-lg-4" *ngIf="items.length > 0">
            <div class="summary-card-v6 p-5 sticky-top reveal-v6" style="top: 120px;">
              <h3 class="fw-950 text-white mb-4">Support Summary</h3>
              
              <div class="summary-line-v6 mb-3">
                <span class="label">Nutritional Value</span>
                <span class="val">₹{{ subtotal }}</span>
              </div>
              <div class="summary-line-v6 mb-3">
                <span class="label">Distribution</span>
                <span class="val text-emerald">FREE</span>
              </div>
              
              <div class="divider-v6 my-4"></div>
              
              <div class="d-flex justify-content-between align-items-end mb-5">
                <div>
                  <span class="text-white text-opacity-40 x-small d-block mb-1">TOTAL CONTRIBUTION</span>
                  <h2 class="fw-950 text-white mb-0">₹{{ subtotal }}</h2>
                </div>
                <div class="text-white text-opacity-30 fw-900">INR</div>
              </div>

              <!-- DYNAMIC IMPACT DASHBOARD -->
              <div class="impact-dashboard-v6 p-4 mb-5">
                <div class="d-flex gap-3 align-items-start">
                  <div class="impact-icon-v6">
                    <i class="bi bi-heart-pulse-fill"></i>
                  </div>
                  <div>
                    <h6 class="fw-900 text-white mb-2">Clinical Impact</h6>
                    <div class="impact-stat-v6 mb-2">
                      <span class="stat-num text-emerald">{{ childrenImpact }}</span>
                      <span class="stat-label">Children supported</span>
                    </div>
                    <div class="impact-stat-v6">
                      <span class="stat-num text-blue">{{ doseImpact }}</span>
                      <span class="stat-label">Nutritional doses</span>
                    </div>
                  </div>
                </div>
              </div>

              <a routerLink="/checkout" class="btn-cta-v6 w-100 mb-4 py-3 d-flex align-items-center justify-content-center">
                PROCEED TO SUPPORT <i class="bi bi-arrow-right-circle-fill ms-3 fs-5"></i>
              </a>

              <p class="text-center text-white text-opacity-40 x-small mb-0">
                <i class="bi bi-shield-lock-fill me-2"></i> Your support directly contributes to fighting malnutrition.
              </p>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <ng-template #emptyCart>
            <div class="col-12 text-center py-100 reveal-v6">
              <div class="empty-icon-v6 mb-4 mx-auto">
                <i class="bi bi-box-seam"></i>
              </div>
              <h2 class="display-5 fw-950 text-white mb-3">No Active Missions</h2>
              <p class="text-white text-opacity-40 fs-5 mb-5 mx-auto" style="max-width: 450px;">
                Your contribution cart is currently empty. Start a mission by selecting a nutritional kit.
              </p>
              <a routerLink="/shop" class="btn-cta-v6 px-5 py-3 rounded-pill">
                EXPLORE COLLECTION
              </a>
            </div>
          </ng-template>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-obsidian-v6 {
      background: #020617;
      min-height: 100vh;
      color: #fff;
      overflow-x: hidden;
      position: relative;
    }

    .py-100 { padding-top: 120px; padding-bottom: 100px; }

    /* --- CINEMATIC ATMOSPHERE --- */
    .aura-container {
      position: absolute; inset: 0; overflow: hidden; z-index: 1; pointer-events: none;
    }
    .aura-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6;
      mix-blend-mode: screen;
    }
    .aura-emerald {
      width: 80vw; height: 80vh; background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
      top: -20%; left: -10%; animation: float-v6 25s infinite alternate ease-in-out;
    }
    .aura-navy {
      width: 60vw; height: 60vh; background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
      bottom: -10%; right: -10%; animation: float-v6 30s infinite alternate-reverse ease-in-out;
    }
    .aura-violet {
      width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
      top: 30%; left: 30%; animation: float-v6 35s infinite alternate ease-in-out;
    }

    @keyframes float-v6 {
      0% { transform: translate(0,0) scale(1); }
      100% { transform: translate(100px, 50px) scale(1.1); }
    }

    .tech-grid-overlay {
      position: absolute; inset: 0; z-index: 2; opacity: 0.15; pointer-events: none;
      background-image: 
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
    }

    .bg-noise {
      position: absolute;
      inset: 0; opacity: 0.02; z-index: 2; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* --- UI ELEMENTS --- */
    .glass-chip-v6 {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 6px 16px; border-radius: 100px;
      font-size: 0.75rem; font-weight: 800; letter-spacing: 2px;
      display: inline-flex; align-items: center;
    }

    .pulse-dot-v6 {
      width: 8px; height: 8px; background: #10b981; border-radius: 50%;
      margin-right: 10px; box-shadow: 0 0 10px #10b981;
      animation: pulse-v6 2s infinite;
    }

    @keyframes pulse-v6 {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }

    .tracking-tighter { letter-spacing: -2px; }
    .letter-spacing-neg-1 { letter-spacing: -1px; }

    /* --- ITEM CARDS --- */
    .cart-item-glass-v6 {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      backdrop-filter: blur(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .cart-item-glass-v6:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(16, 185, 129, 0.5);
      transform: scale(1.01);
    }

    .item-img-wrap-v6 {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px; padding: 12px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    }

    .badge-v6 {
      font-size: 0.65rem; font-weight: 900; letter-spacing: 1px;
      color: rgba(255,255,255,0.7);
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 10px; border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-transform: uppercase;
    }
    .badge-v6.emerald { 
      color: #10b981; 
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.2);
    }

    .text-emerald { color: #10b981 !important; }
    .text-blue { color: #3b82f6 !important; }

    .qty-stepper-v6 {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px; padding: 6px;
      display: flex; align-items: center; justify-content: space-between;
      width: 140px;
    }
    .qty-stepper-v6 button {
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: rgba(255, 255, 255, 0.1); color: #fff; transition: 0.3s;
      display: flex; align-items: center; justify-content: center;
    }
    .qty-stepper-v6 button:hover:not(:disabled) { 
      background: #10b981; color: #020617; 
      transform: scale(1.1);
    }
    .qty-stepper-v6 span { 
      font-weight: 950; font-size: 1.2rem; 
      color: #fff; font-family: 'Space Grotesk', sans-serif;
    }

    .item-total-v6 { 
      font-size: 2rem; font-weight: 950; color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -1px;
    }

    .item-price-glow {
      color: #10b981 !important;
      font-weight: 950 !important;
      font-size: 1.25rem !important;
    }
    .btn-remove-v6 {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      width: 40px; height: 40px; border-radius: 10px;
      color: #ef4444; display: flex; align-items: center; justify-content: center;
      transition: 0.3s;
    }
    .btn-remove-v6:hover { background: #ef4444; color: #fff; }

    /* --- SUMMARY PANEL --- */
    .summary-card-v6 {
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 40px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;
    }
    .summary-card-v6::before {
      content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .summary-line-v6 { display: flex; justify-content: space-between; align-items: center; }
    .summary-line-v6 .label { color: rgba(255, 255, 255, 0.6); font-weight: 800; font-size: 0.9rem; }
    .summary-line-v6 .val { font-weight: 950; font-size: 1.1rem; color: #fff; }

    .divider-v6 { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }

    /* --- IMPACT DASHBOARD --- */
    .impact-dashboard-v6 {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 24px;
    }

    .impact-icon-v6 {
      width: 44px; height: 44px; background: #10b981; color: #020617;
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; animation: pulse-v6 3s infinite ease-in-out;
    }

    .impact-stat-v6 { display: flex; align-items: baseline; gap: 8px; }
    .stat-num { font-size: 1.2rem; font-weight: 950; }
    .stat-label { font-size: 0.75rem; font-weight: 700; color: rgba(255, 255, 255, 0.4); }

    .btn-cta-v6 {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      color: #fff; border: none;
      border-radius: 100px; font-weight: 950; letter-spacing: 1px;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
      text-decoration: none;
    }
    .btn-cta-v6:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 30px 60px rgba(59, 130, 246, 0.4);
      filter: brightness(1.1);
    }

    /* --- EMPTY STATE --- */
    .empty-icon-v6 {
      width: 120px; height: 120px; background: rgba(255, 255, 255, 0.03);
      border-radius: 40px; display: flex; align-items: center; justify-content: center;
      font-size: 4rem; color: rgba(255, 255, 255, 0.1);
    }

    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }

    @media (max-width: 991px) {
      .summary-card-v6 { margin-top: 40px; position: relative !important; top: 0 !important; }
    }
  `]
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  cartItems$: Observable<CartItem[]>;
  subtotal = 0;
  childrenImpact = 0;
  doseImpact = 0;
  Math = Math;

  constructor(
    private cartService: CartService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(() => {
      this.subtotal = this.cartService.getCartTotal();
      this.updateImpact();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.zone.runOutsideAngular(() => {
      gsap.from('.reveal-v6', {
        y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
      });
    });
  }

  ngOnDestroy(): void {}

  private updateImpact(): void {
    this.childrenImpact = Math.ceil(this.subtotal / 110);
    this.doseImpact = Math.ceil(this.subtotal / 22);
  }

  updateQty(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.id, item.quantity + delta, item.option);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.option);
  }
}
