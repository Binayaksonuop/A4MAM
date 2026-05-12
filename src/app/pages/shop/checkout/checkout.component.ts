import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import gsap from 'gsap';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-obsidian-v6">
      <!-- Cinematic Background System -->
      <div class="aura-container">
        <div class="aura-orb aura-emerald"></div>
        <div class="aura-orb aura-navy"></div>
        <div class="aura-orb aura-violet"></div>
      </div>
      <div class="tech-grid-overlay"></div>
      <div class="bg-noise"></div>

      <div class="container position-relative z-3 py-100">
        <div class="mb-5 reveal-v6">
          <div class="glass-chip-v6 mb-3">
            <span class="pulse-dot-v6"></span> MISSION VALIDATION
          </div>
          <h1 class="display-3 fw-950 text-white mb-2">Finalize Your <span class="text-gradient-mixed-v6">Mission</span></h1>
          <p class="text-white text-opacity-50 fs-5">Secure the distribution of life-saving clinical nutrition.</p>
        </div>

        <div class="row g-5">
          <!-- Left: Multi-Step Form -->
          <div class="col-lg-7">
            <div class="checkout-glass-card-v6 p-4 p-md-5 reveal-v6">
              <form #checkoutForm="ngForm" (ngSubmit)="placeOrder()">
                <!-- STEP 1: PERSONAL & LOGISTICS -->
                <div class="step-section-v6 mb-5">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="step-num-v6">01</div>
                    <h4 class="fw-900 text-white mb-0">Distribution Logistics</h4>
                  </div>
                  <div class="row g-4 mb-4">
                    <div class="col-md-6">
                      <div class="input-group-v6">
                        <label>Recipient Name</label>
                        <input type="text" name="name" [(ngModel)]="formData.name" placeholder="Enter Full Name" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="input-group-v6">
                        <label>Contact Coordination (Phone)</label>
                        <input type="tel" name="phone" [(ngModel)]="formData.phone" placeholder="Enter Mobile Number" required>
                      </div>
                    </div>
                  </div>
                  <div class="input-group-v6 mb-4">
                    <label>Email Coordination</label>
                    <input type="email" name="email" [(ngModel)]="formData.email" placeholder="Enter Email Address" required>
                  </div>
                  <div class="input-group-v6 mb-4">
                    <label>Operational Hub (Full Address)</label>
                    <textarea name="address" [(ngModel)]="formData.address" rows="3" placeholder="Street, Landmark, Apartment" required></textarea>
                  </div>
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="input-group-v6">
                        <label>City / Region</label>
                        <input type="text" name="city" [(ngModel)]="formData.city" placeholder="Enter City" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="input-group-v6">
                        <label>Sector Code (Pincode)</label>
                        <input type="text" name="pincode" [(ngModel)]="formData.pincode" placeholder="Enter Pincode" required>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- STEP 2: PAYMENT METHOD -->
                <div class="step-section-v6 mb-5">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="step-num-v6">02</div>
                    <h4 class="fw-900 text-white mb-0">Selection of Channel</h4>
                  </div>
                  <div class="payment-grid-v6 mb-4">
                    <div class="payment-option-v6" [class.active]="paymentMethod === 'upi'" (click)="paymentMethod = 'upi'">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-3">
                          <div class="pay-icon-v6"><i class="bi bi-qr-code-scan"></i></div>
                          <div>
                            <div class="pay-title-v6">UPI Transfer</div>
                            <div class="pay-sub-v6">Instant Digital Verification</div>
                          </div>
                        </div>
                        <div class="pay-check-v6" [class.checked]="paymentMethod === 'upi'"></div>
                      </div>
                    </div>
                    <div class="payment-option-v6" [class.active]="paymentMethod === 'cod'" (click)="paymentMethod = 'cod'">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-3">
                          <div class="pay-icon-v6 secondary"><i class="bi bi-truck"></i></div>
                          <div>
                            <div class="pay-title-v6">COD (Pay on Arrival)</div>
                            <div class="pay-sub-v6">Logistics Verification Only</div>
                          </div>
                        </div>
                        <div class="pay-check-v6" [class.checked]="paymentMethod === 'cod'"></div>
                      </div>
                    </div>
                  </div>

                  <!-- UPI PHASE: QR SCAN -->
                  <div class="upi-phase-v6 p-4 mt-4" *ngIf="paymentMethod === 'upi'">
                    <div class="row align-items-center g-4">
                      <div class="col-md-4 text-center">
                        <div class="qr-container-v6 p-2 bg-white rounded-3 shadow-glow-qr" (click)="toggleQrLightbox()" style="cursor: zoom-in;">
                          <img src="assets/images/A4%20QR.jpeg" alt="UPI QR" class="img-fluid">
                          <div class="qr-hint-v6"><i class="bi bi-arrows-fullscreen"></i> Tap to Enlarge</div>
                        </div>
                        <div class="mt-3 x-small text-white text-opacity-90">After completing payment in your UPI app, click the button below.</div>
                      </div>
                      <div class="col-md-8">
                        <h6 class="fw-900 text-white mb-2">Secure UPI Gateway</h6>
                        <p class="text-white text-opacity-40 small mb-4">
                          Scan the QR code with any UPI app (GPay, PhonePe, Paytm) to complete the nutritional intervention.
                        </p>
                        <div class="upi-id-box-v6 p-3 d-flex justify-content-between align-items-center">
                          <div>
                            <span class="x-small text-white text-opacity-30 d-block">UPI ID</span>
                            <span class="fw-800 text-emerald">9642437773&#64;okbizaxis</span>
                          </div>
                          <i class="bi bi-shield-lock-fill text-emerald fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- COD INFO -->
                  <div class="cod-info-v6 p-4 mt-4" *ngIf="paymentMethod === 'cod'">
                    <div class="d-flex gap-3 align-items-center">
                      <i class="bi bi-truck text-blue fs-3"></i>
                      <div>
                        <h6 class="fw-900 text-white mb-1">Pay at Delivery (COD)</h6>
                        <p class="text-white text-opacity-50 small mb-0">
                          Secure your mission today. Contribution funds will be collected by our logistics partner upon arrival at your operation hub.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-cta-v6 w-100 py-4 fs-5 text-white fw-bold" [disabled]="isProcessing || !checkoutForm.form.valid">
                  <span *ngIf="!isProcessing">
                    <span *ngIf="paymentMethod === 'upi'">I HAVE COMPLETED PAYMENT <i class="bi bi-arrow-right-circle-fill ms-2 text-white"></i></span>
                    <span *ngIf="paymentMethod === 'cod'">PLACE COD ORDER <i class="bi bi-truck ms-2 text-white"></i></span>
                  </span>
                  <span *ngIf="isProcessing">
                    <span class="spinner-border spinner-border-sm me-3"></span> ALLOCATING MISSION...
                  </span>
                </button>
              </form>
            </div>
          </div>

          <!-- Right: Summary & Trust -->
          <div class="col-lg-5">
            <div class="summary-glass-card-v6 p-5 sticky-top reveal-v6" style="top: 160px;">
              <h4 class="fw-950 text-white mb-4">Order <span class="text-gradient-mixed-v6">Validation</span></h4>
              <div class="preview-list-v6 mb-4">
                <div class="preview-item-v6 d-flex align-items-center gap-3 mb-3" *ngFor="let item of cartItems">
                  <div class="preview-thumb-v6">
                    <img [src]="item.image" [alt]="item.name" onerror="this.src='assets/images/placeholder.png'">
                    <span class="preview-qty-v6">{{ item.quantity }}</span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-white fw-800 small">{{ item.name }}</div>
                    <div class="text-white text-opacity-30 x-small">{{ item.option === 'Donation' ? 'Mission Contribution' : 'Clinical Grade Nutrition' }}</div>
                  </div>
                  <div class="text-white fw-950">₹{{ item.price * item.quantity }}</div>
                </div>
              </div>

              <div class="pt-4 border-top border-white border-opacity-10 mb-5">
                <div class="summary-line-v6 mb-2">
                  <span class="label">Subtotal</span>
                  <span class="val">₹{{ total }}</span>
                </div>
                <div class="summary-line-v6 mb-4">
                  <span class="label">Mission Distribution</span>
                  <span class="val text-emerald">FREE</span>
                </div>
                <div class="d-flex justify-content-between mb-4">
                  <div>
                    <span class="text-white text-opacity-40 x-small d-block mb-1">FINAL CONTRIBUTION</span>
                    <h3 class="fw-950 text-white mb-0">₹{{ total }}</h3>
                  </div>
                  <div class="currency-label-v6">INR</div>
                </div>
                <!-- TRUST MODULE -->
                <div class="trust-module-v6 p-4">
                  <div class="d-flex gap-3 align-items-center mb-3">
                    <div class="trust-icon-v6"><i class="bi bi-heart-fill"></i></div>
                    <div class="text-white fw-900 small">Verified Mission Impact</div>
                  </div>
                  <p class="text-white text-opacity-40 x-small mb-0">
                    Your contribution directly supports approximately <strong>{{ Math.floor(total / 25) }} days</strong> of critical nutritional recovery for children.
                  </p>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-center gap-4 opacity-30 grayscale-filter">
                <i class="bi bi-shield-lock-fill fs-3"></i>
                <i class="bi bi-patch-check-fill fs-3"></i>
                <i class="bi bi-safe2-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- QR LIGHTBOX OVERLAY (At root of component for max z-index) -->
      <div class="qr-lightbox-overlay" *ngIf="isQrLightboxOpen" (click)="toggleQrLightbox()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="btn-close-lightbox" (click)="toggleQrLightbox()"><i class="bi bi-x-lg"></i></button>
          <img src="assets/images/A4%20QR.jpeg" alt="UPI QR Full" class="qr-full-img">
          <div class="lightbox-footer text-center mt-3">
            <h5 class="text-white fw-bold mb-1">Scan & Pay</h5>
            <p class="text-white text-opacity-50 small mb-0">A4MAM Mission Contribution</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-obsidian-v6 {
      background: #020617;
      min-height: 100vh; color: #fff;
      position: relative; overflow-x: hidden;
    }

    .py-100 { padding-top: 160px; padding-bottom: 100px; }

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

    .text-gradient-mixed-v6 {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* --- FORM CARDS --- */
    .checkout-glass-card-v6 {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 40px;
      backdrop-filter: blur(25px);
      box-shadow: 0 40px 80px rgba(0,0,0,0.4);
    }

    .step-num-v6 {
      width: 40px; height: 40px; background: #10b981; color: #020617;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 1.1rem;
    }

    .input-group-v6 { display: flex; flex-direction: column; gap: 8px; }
    .input-group-v6 label {
      font-size: 0.7rem; font-weight: 900; color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase; letter-spacing: 1px; margin-left: 10px;
    }
    .input-group-v6 input, .input-group-v6 textarea {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px; padding: 16px 24px;
      color: #fff; font-weight: 600; transition: all 0.3s ease;
    }
    .input-group-v6 input:focus, .input-group-v6 textarea:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: #10b981; outline: none;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
    }

    /* --- PAYMENT --- */
    .payment-grid-v6 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .payment-option-v6 {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px; padding: 24px;
      cursor: pointer; transition: all 0.3s ease;
    }
    .payment-option-v6:hover { background: rgba(255, 255, 255, 0.05); }
    .payment-option-v6.active {
      background: rgba(16, 185, 129, 0.05);
      border-color: #10b981;
    }

    .pay-icon-v6 {
      width: 44px; height: 44px; background: rgba(16, 185, 129, 0.1);
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; color: #10b981;
    }
    .pay-icon-v6.secondary { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .pay-title-v6 { font-weight: 900; font-size: 0.95rem; }
    .pay-sub-v6 { font-size: 0.7rem; color: rgba(255, 255, 255, 0.3); font-weight: 700; }

    .pay-check-v6 {
      width: 22px; height: 22px; border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%; position: relative; transition: 0.2s;
    }
    .pay-check-v6.checked { border-color: #10b981; }
    .pay-check-v6.checked::after {
      content: ''; position: absolute; inset: 4px; background: #10b981; border-radius: 50%;
    }

    /* UPI QR PHASE */
    .upi-phase-v6 {
      background: rgba(16, 185, 129, 0.03);
      border: 1px solid rgba(16, 185, 129, 0.1);
      border-radius: 24px;
    }
    .qr-container-v6 { width: 200px; height: 200px; margin: 0 auto; overflow: hidden; background: #ffffff !important; display: flex; align-items: center; justify-content: center; }
    .qr-container-v6 img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .shadow-glow { box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); }
    .shadow-glow-qr { box-shadow: 0 0 40px rgba(255, 255, 255, 0.2), 0 0 25px rgba(16, 185, 129, 0.6); }
    .upi-id-box-v6 {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* COD INFO */
    .cod-info-v6 {
      background: rgba(59, 130, 246, 0.03);
      border: 1px solid rgba(59, 130, 246, 0.1);
      border-radius: 24px;
    }

    /* --- SUMMARY PANEL --- */
    .summary-glass-card-v6 {
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 40px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;
    }

    .summary-line-v6 { display: flex; justify-content: space-between; align-items: center; }
    .summary-line-v6 .label { color: rgba(255, 255, 255, 0.4); font-size: 0.85rem; font-weight: 700; }
    .summary-line-v6 .val { color: #fff; font-weight: 900; }

    .preview-thumb-v6 {
      width: 50px; height: 50px; background: rgba(255, 255, 255, 0.05);
      border-radius: 12px; position: relative; padding: 5px;
    }
    .preview-thumb-v6 img { width: 100%; height: 100%; object-fit: contain; }
    .preview-qty-v6 {
      position: absolute; top: -8px; right: -8px;
      background: #10b981; color: #020617;
      width: 18px; height: 18px; border-radius: 50%;
      font-size: 0.6rem; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
    }

    .trust-module-v6 {
      background: rgba(16, 185, 129, 0.03);
      border: 1px dashed rgba(16, 185, 129, 0.2);
      border-radius: 24px;
    }
    .trust-icon-v6 { color: #ef4444; font-size: 1.2rem; }

    .grayscale-filter { filter: grayscale(1) opacity(0.5); }

    .btn-cta-v6 {
      background: linear-gradient(135deg, #10b981 0%, #2563eb 100%);
      color: #ffffff !important; border: none;
      border-radius: 100px; font-weight: 900; letter-spacing: 1.5px;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
    }
    .btn-cta-v6:hover:not(:disabled) {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.6), 0 30px 60px rgba(59, 130, 246, 0.5);
      filter: brightness(1.15);
    }
    .btn-cta-v6:active:not(:disabled) {
      transform: scale(0.98);
    }
    .btn-cta-v6:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.5); }

    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }

    /* --- QR LIGHTBOX --- */
    .qr-container-v6 { position: relative; }
    .qr-hint-v6 {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(16, 185, 129, 0.9); color: #fff;
      font-size: 0.65rem; font-weight: 800; padding: 4px;
      opacity: 0; transition: 0.3s;
    }
    .qr-container-v6:hover .qr-hint-v6 { opacity: 1; }

    .qr-lightbox-overlay {
      position: fixed; 
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 999999; /* Max priority */
      background: rgba(1, 4, 18, 0.92);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      display: flex; align-items: center; justify-content: center;
      padding: 30px; animation: fadeIn-v6 0.4s ease-out;
    }

    .lightbox-content {
      position: relative; 
      max-width: 500px; 
      width: 95%;
      background: #ffffff; 
      padding: 24px; 
      border-radius: 40px;
      box-shadow: 0 50px 100px rgba(0,0,0,0.9);
      animation: zoomIn-v6 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .qr-full-img { 
      width: 100%; 
      max-height: 70vh; 
      object-fit: contain; 
      border-radius: 20px; 
      margin: 0 auto;
    }

    .btn-close-lightbox {
      position: absolute; top: -50px; right: 0;
      background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff; width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: 0.3s;
    }
    .btn-close-lightbox:hover { background: #ef4444; border-color: #ef4444; }

    .lightbox-footer h5 { color: #020617 !important; }
    .lightbox-footer p { color: rgba(2, 6, 23, 0.5) !important; }

    @keyframes fadeIn-v6 { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn-v6 { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

    @media (max-width: 991px) {
      .payment-grid-v6 { grid-template-columns: 1fr; }
      .summary-glass-card-v6 { margin-top: 40px; position: relative !important; top: 0 !important; }
    }
  `]
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  cartItems: any[] = [];
  total = 0;
  paymentMethod: 'upi' | 'cod' = 'upi';
  isProcessing = false;
  hasDonation = false;
  isQrLightboxOpen = false;
  Math = Math;

  formData = {
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleQrLightbox(): void {
    this.isQrLightboxOpen = !this.isQrLightboxOpen;
    if (this.isBrowser) {
      if (this.isQrLightboxOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.hasDonation = items.some((item: any) => item.option === 'Donation');
      this.total = this.cartService.getCartTotal();
      if (this.total === 0 && this.isBrowser) {
        this.router.navigate(['/shop']);
      }
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

  ngOnDestroy(): void { }

  placeOrder(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    // Map cart items for backend
    const items = this.cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const orderData = {
      customerName: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      address: this.formData.address,
      city: this.formData.city,
      state: '', // Add state if needed
      pincode: this.formData.pincode,
      items: items,
      totalAmount: this.total,
      paymentMethod: this.paymentMethod.toLowerCase(),
      paymentStatus: this.paymentMethod === 'upi' ? 'Paid' : 'Pending'
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        if (response.success) {
          const donationItem = this.cartItems.find((i: any) => i.option === 'Donation');
          const realOrderId = response.data.orderId;
          this.cartService.clearCart();

          this.router.navigate(['/order-success'], {
            queryParams: {
              orderId: realOrderId,
              amount: this.total,
              method: this.paymentMethod,
              name: this.formData.name,
              city: this.formData.city,
              isDonation: this.hasDonation ? 'true' : 'false',
              planName: donationItem ? donationItem.name : ''
            }
          });
        }
        this.isProcessing = false;
      },
      error: (err: any) => {
        this.isProcessing = false;
        alert(err.error?.message || 'Failed to place mission order. Please check your connection.');
      }
    });
  }
}
