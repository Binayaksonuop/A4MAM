import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-page py-5 mt-5">
      <div class="success-mesh-bg"></div>
      
      <div class="container position-relative z-2">
        <div class="row justify-content-center">
          <div class="col-lg-7">
            <div class="success-card-premium p-5 rounded-5 text-center shadow-2xl">
              <div class="success-icon-animation mb-5">
                <div class="check-circle">
                  <i class="bi bi-check-lg"></i>
                </div>
                <div class="confetti-item c1"></div>
                <div class="confetti-item c2"></div>
                <div class="confetti-item c3"></div>
                <div class="confetti-item c4"></div>
              </div>

              <span class="badge-premium-emerald mb-3 d-inline-block">Impact Initiated</span>
              <h1 class="display-4 fw-950 text-slate-900 mb-3">Order <span class="text-gradient-emerald">Confirmed!</span></h1>
              <p class="lead text-slate-500 mb-5 fw-600">
                Your contribution to the Mission Against Malnutrition has been successfully received. 
                Our distribution team is now preparing the intervention.
              </p>

              <div class="order-details-premium p-4 rounded-4 mb-5 d-flex flex-wrap justify-content-center gap-4">
                <div class="detail-item">
                  <span class="x-small text-slate-400 d-block mb-1">REFERENCE ID</span>
                  <span class="fw-950 text-slate-800 fs-5">{{ orderId }}</span>
                </div>
                <div class="divider-v"></div>
                <div class="detail-item">
                  <span class="x-small text-slate-400 d-block mb-1">STATUS</span>
                  <span class="status-pill-emerald">PROCESSING</span>
                </div>
                <div class="divider-v"></div>
                <div class="detail-item">
                  <span class="x-small text-slate-400 d-block mb-1">EST. DELIVERY</span>
                  <span class="fw-950 text-slate-800 fs-5">3-5 Clinical Days</span>
                </div>
              </div>

              <div class="impact-reward-box p-4 rounded-5 mb-5">
                <div class="impact-label mb-3">YOUR DIRECT IMPACT</div>
                <div class="d-flex align-items-center justify-content-center gap-4">
                  <div class="impact-stat">
                    <h2 class="fw-950 text-emerald mb-0">100%</h2>
                    <span class="x-small text-slate-500">BIO-AVAILABLE</span>
                  </div>
                  <div class="divider-v opacity-20"></div>
                  <div class="impact-stat text-start" style="max-width: 250px;">
                    <p class="small mb-0 text-slate-600 leading-tight">
                      This order specifically funds a complete clinical recovery protocol for an identified child in our target region.
                    </p>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-3 d-md-flex justify-content-center">
                <button (click)="goHome()" class="btn btn-emerald-lg px-5 py-3 fw-900 rounded-pill hover-scale">
                  Return to Dashboard
                </button>
                <button (click)="goShop()" class="btn btn-outline-premium px-5 py-3 fw-900 rounded-pill hover-scale">
                  Continue Distribution
                </button>
              </div>

              <p class="mt-5 text-slate-400 small fw-700">
                Auto-redirecting to dashboard in <span class="text-emerald fw-950">{{ countdown }}</span> seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page { 
      background: #f8fafc; 
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .success-mesh-bg {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 600px;
      background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12), transparent 70%);
      pointer-events: none;
    }

    .success-card-premium {
      background: white;
      border: 1px solid rgba(0,0,0,0.03);
      box-shadow: 0 40px 100px rgba(0,0,0,0.08);
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

    /* ── Success Animation ── */
    .success-icon-animation {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }
    .check-circle {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
      animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .confetti-item {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      opacity: 0;
    }
    .c1 { background: #10b981; top: 0; left: -20px; animation: confetti 1s 0.3s ease-out infinite; }
    .c2 { background: #3b82f6; top: -20px; right: -20px; animation: confetti 1s 0.4s ease-out infinite; }
    .c3 { background: #fbbf24; bottom: -10px; left: -30px; animation: confetti 1s 0.5s ease-out infinite; }
    .c4 { background: #ec4899; bottom: 0; right: -40px; animation: confetti 1s 0.6s ease-out infinite; }

    @keyframes scale-up {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes confetti {
      0% { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx, 20px), var(--ty, -20px)) scale(0); opacity: 0; }
    }
    .c1 { --tx: -40px; --ty: -40px; }
    .c2 { --tx: 40px; --ty: -50px; }
    .c3 { --tx: -50px; --ty: 40px; }
    .c4 { --tx: 60px; --ty: 20px; }

    /* ── Details Box ── */
    .order-details-premium {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .divider-v {
      width: 1px;
      background: #e2e8f0;
      align-self: stretch;
    }
    .status-pill-emerald {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      font-size: 0.75rem;
      font-weight: 900;
      padding: 4px 12px;
      border-radius: 50px;
    }

    /* ── Impact Box ── */
    .impact-reward-box {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
    }
    .impact-label {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: rgba(255,255,255,0.4);
    }

    .btn-emerald-lg {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
    .btn-outline-premium {
      background: white;
      border: 2px solid #e2e8f0;
      color: #64748b;
    }
    .btn-outline-premium:hover {
      border-color: #10b981;
      color: #10b981;
    }

    .text-gradient-emerald {
      background: linear-gradient(90deg, #059669, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }
    .hover-scale:hover { transform: scale(1.05); }
    .leading-tight { line-height: 1.3; }
    @media (max-width: 767px) {
      .divider-v { display: none; }
      .order-details-premium { flex-direction: column; gap: 20px !important; }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
  countdown: number = 10;
  private timer: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get order details from query params
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'A4M-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    });

    // Auto-redirect to home after 10 seconds
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  goHome() {
    clearInterval(this.timer);
    this.router.navigate(['/']);
  }

  goShop() {
    clearInterval(this.timer);
    this.router.navigate(['/shop']);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
