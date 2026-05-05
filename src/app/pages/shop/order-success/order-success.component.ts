import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-obsidian-v6">
      <!-- Cinematic Background System -->
      <div class="aura-container">
        <div class="aura-orb aura-emerald"></div>
        <div class="aura-orb aura-navy"></div>
        <div class="aura-orb aura-violet"></div>
      </div>
      <div class="tech-grid-overlay"></div>
      <div class="bg-noise"></div>

      <div class="container position-relative z-3 py-100">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            
            <!-- CINEMATIC VALIDATION STAGE -->
            <div class="validation-stage-v6" *ngIf="isValidating">
              <div class="scanner-wrap mb-5" [class]="currentStepColor">
                <div class="scanner-line"></div>
                <div class="icon-orb-v6">
                  <i class="bi {{ currentStepIcon }} fs-1"></i>
                </div>
                <div class="glow-pulse-v6"></div>
              </div>
              
              <div class="text-center overflow-hidden">
                <h2 class="fw-950 text-white mb-2 step-text-v6">{{ currentStepText }}</h2>
                <div class="progress-container-v6 mx-auto">
                  <div class="progress-bar-v6">
                    <div class="progress-fill-v6" [style.width.%]="validationProgress" [class]="currentStepColor"></div>
                  </div>
                  <div class="progress-glow-v6" [style.width.%]="validationProgress" [class]="currentStepColor"></div>
                </div>
              </div>
              
              <div class="mt-4 d-flex justify-content-center gap-4">
                <div class="step-indicator-v6" [class.active]="validationProgress >= 33"></div>
                <div class="step-indicator-v6" [class.active]="validationProgress >= 66"></div>
                <div class="step-indicator-v6" [class.active]="validationProgress >= 100"></div>
              </div>
              <p class="text-white text-opacity-30 mt-4 x-small tracking-wider ls-2">CLINICAL GATEWAY STATUS: ACTIVE</p>
            </div>

            <!-- MISSION DASHBOARD -->
            <div class="mission-card-v6 p-5 reveal-v6" [class.d-none]="isValidating">
              
              <!-- Success Pulse Icon -->
              <div class="success-pulse-v6 mb-5">
                <div class="pulse-ring" [class.blue]="method==='cod'"></div>
                <div class="pulse-core" [class.bg-blue]="method==='cod'">
                  <i class="bi" [class.bi-shield-check]="method==='upi'" [class.bi-truck]="method==='cod'"></i>
                </div>
              </div>

              <div class="text-center mb-5">
                <div class="glass-chip-v6 mb-3">
                  <span class="status-dot-v6" [class.bg-blue]="method==='cod'"></span> 
                  {{ method === 'upi' ? 'MISSION COMPLETE' : 'MISSION SCHEDULED' }}
                </div>
                <h1 class="display-3 fw-950 text-white mb-2">
                  {{ method === 'upi' ? 'Contribution' : 'Mission' }} 
                  <span class="text-gradient-mixed-v6" [class.blue-v6]="method==='cod'">
                    {{ method === 'upi' ? 'Validated' : 'Reserved' }}
                  </span>
                </h1>
                <div *ngIf="isDonation && planName" class="mb-3">
                  <span class="badge bg-white bg-opacity-10 text-emerald border border-success border-opacity-25 px-3 py-2 rounded-pill fs-6"><i class="bi bi-star-fill me-2 text-warning"></i>{{ planName }}</span>
                </div>
                <p class="text-white text-opacity-50 fs-5 mx-auto" style="max-width: 600px;">
                  {{ method === 'upi' ? 
                    'Your payment has been verified. Your contribution is now part of a live nutrition intervention system.' : 
                    'Your nutrition kit has been reserved for delivery to ' + city + '. Contribution will be completed on arrival.' }}
                </p>
              </div>

              <div class="row g-4 mb-5">
                <!-- IMPACT STATS -->
                <div class="col-md-4">
                  <div class="impact-stat-v6 p-4">
                    <div class="circular-progress-v6 mb-3">
                      <svg viewBox="0 0 100 100">
                        <circle class="bg" cx="50" cy="50" r="45"></circle>
                        <circle class="fg" [class.blue]="method==='cod'" cx="50" cy="50" r="45" style="--val: 100"></circle>
                      </svg>
                      <div class="stat-icon" [class.text-blue]="method==='cod'"><i class="bi bi-people-fill"></i></div>
                    </div>
                    <div class="stat-val counter-v6" [class.text-emerald]="method==='upi'" [class.text-blue]="method==='cod'">{{ childrenImpact }}</div>
                    <div class="stat-label">Children Supported</div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="impact-stat-v6 p-4">
                    <div class="circular-progress-v6 mb-3">
                      <svg viewBox="0 0 100 100">
                        <circle class="bg" cx="50" cy="50" r="45"></circle>
                        <circle class="fg blue" cx="50" cy="50" r="45" style="--val: 100"></circle>
                      </svg>
                      <div class="stat-icon blue"><i class="bi bi-capsule"></i></div>
                    </div>
                    <div class="stat-val text-blue counter-v6">{{ doseImpact }}</div>
                    <div class="stat-label">Nutrient Doses</div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="impact-stat-v6 p-4">
                    <div class="circular-progress-v6 mb-3">
                      <svg viewBox="0 0 100 100">
                        <circle class="bg" cx="50" cy="50" r="45"></circle>
                        <circle class="fg violet" cx="50" cy="50" r="45" style="--val: 100"></circle>
                      </svg>
                      <div class="stat-icon violet"><i class="bi bi-activity"></i></div>
                    </div>
                    <div class="stat-val text-violet">{{ method === 'upi' ? 'LIVE' : 'PENDING' }}</div>
                    <div class="stat-label">{{ method === 'upi' ? 'Monitoring Initiated' : 'Awaiting Delivery' }}</div>
                  </div>
                </div>
              </div>

              <!-- TRANSACTION SUMMARY -->
              <div class="fintech-summary-v6 p-4 mb-5">
                <div class="row g-4 text-center text-md-start">
                  <div class="col-md-3">
                    <div class="f-label">REFERENCE ID</div>
                    <div class="f-val">{{ orderId }}</div>
                  </div>
                  <div class="col-md-3">
                    <div class="f-label">CHANNEL</div>
                    <div class="f-val" [class.text-emerald]="method==='upi'" [class.text-blue]="method==='cod'">
                      {{ method === 'upi' ? 'UPI / SECURE' : 'COD / LOGISTICS' }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="f-label">MISSION STATUS</div>
                    <div class="f-val text-white">
                      {{ method === 'upi' ? 'Completed' : 'Scheduled' }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="f-label">DESTINATION</div>
                    <div class="f-val text-truncate">{{ city }}</div>
                  </div>
                </div>
              </div>

              <!-- CTAs -->
              <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <a routerLink="/" class="btn-cta-v6 px-5 py-3">
                  RETURN TO DASHBOARD <i class="bi bi-house-door-fill ms-2"></i>
                </a>
                <a routerLink="/gallery" class="btn-outline-v6 px-5 py-3">
                  VIEW IMPACT GALLERY <i class="bi bi-images ms-2"></i>
                </a>
              </div>

              <div class="text-center mt-5">
                <p class="text-white text-opacity-30 x-small mb-0">
                  <i class="bi bi-shield-check-fill me-2"></i> Clinical Validation ID: {{ validationId }}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-obsidian-v6 {
      background: #020617;
      min-height: 100vh; color: #fff;
      position: relative; overflow-x: hidden;
    }

    .py-100 { padding-top: 120px; padding-bottom: 100px; }

    /* --- CINEMATIC VALIDATION STAGE --- */
    .validation-stage-v6 {
      text-align: center; padding: 80px 40px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px; backdrop-filter: blur(40px);
      box-shadow: 0 40px 100px rgba(0,0,0,0.4);
    }
    
    .scanner-wrap {
      width: 140px; height: 140px; margin: 0 auto;
      position: relative; border-radius: 40px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .icon-orb-v6 {
      position: relative; z-index: 5;
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.5s ease;
    }

    .scanner-line {
      position: absolute; inset: 0; 
      border: 2px solid transparent; border-radius: 40px;
      animation: scan-v6 2.5s infinite linear;
    }
    
    @keyframes scan-v6 {
      0% { transform: translateY(-10%) scaleX(1); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(110%) scaleX(1); opacity: 0; }
    }

    /* Step Colors */
    .color-emerald .icon-orb-v6 { color: #10b981; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.3); }
    .color-emerald .scanner-line { border-top-color: #10b981; box-shadow: 0 -5px 15px #10b981; }
    
    .color-teal .icon-orb-v6 { color: #2dd4bf; box-shadow: 0 0 30px rgba(45, 212, 191, 0.2); border-color: rgba(45, 212, 191, 0.3); }
    .color-teal .scanner-line { border-top-color: #2dd4bf; box-shadow: 0 -5px 15px #2dd4bf; }
    
    .color-blue .icon-orb-v6 { color: #3b82f6; box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.3); }
    .color-blue .scanner-line { border-top-color: #3b82f6; box-shadow: 0 -5px 15px #3b82f6; }

    .progress-container-v6 { max-width: 300px; position: relative; margin-top: 20px; }
    .progress-bar-v6 {
      width: 100%; height: 6px; background: rgba(255, 255, 255, 0.05);
      border-radius: 10px; overflow: hidden; position: relative; z-index: 2;
    }
    .progress-fill-v6 {
      height: 100%; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .progress-fill-v6.color-emerald { background: #10b981; }
    .progress-fill-v6.color-teal { background: #2dd4bf; }
    .progress-fill-v6.color-blue { background: #3b82f6; }

    .progress-glow-v6 {
      position: absolute; top: 0; left: 0; height: 6px; filter: blur(8px);
      transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.6;
    }
    .progress-glow-v6.color-emerald { background: #10b981; }
    .progress-glow-v6.color-teal { background: #2dd4bf; }
    .progress-glow-v6.color-blue { background: #3b82f6; }

    .step-indicator-v6 {
      width: 12px; height: 4px; background: rgba(255, 255, 255, 0.1);
      border-radius: 10px; transition: all 0.5s ease;
    }
    .step-indicator-v6.active { background: #fff; width: 24px; box-shadow: 0 0 10px #fff; }

    /* --- CINEMATIC ATMOSPHERE --- */
    .aura-container {
      position: absolute; inset: 0; overflow: hidden; z-index: 1; pointer-events: none;
    }
    .aura-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6;
      mix-blend-mode: screen;
    }
    .aura-emerald {
      width: 80vw; height: 80vh; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
      top: -20%; left: -10%; animation: float-v6 25s infinite alternate ease-in-out;
    }
    .aura-navy {
      width: 60vw; height: 60vh; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      bottom: -10%; right: -10%; animation: float-v6 30s infinite alternate-reverse ease-in-out;
    }
    .aura-violet {
      width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
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

    /* --- MISSION CARD --- */
    .mission-card-v6 {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 40px;
      backdrop-filter: blur(40px);
      box-shadow: 0 50px 100px rgba(0,0,0,0.5);
      position: relative; overflow: hidden;
    }

    /* --- PULSE ICON --- */
    .success-pulse-v6 {
      width: 100px; height: 100px; margin: 0 auto;
      position: relative; display: flex; align-items: center; justify-content: center;
    }
    .pulse-ring {
      position: absolute; width: 100%; height: 100%;
      border: 4px solid #10b981; border-radius: 50%;
      animation: pulse-ring-v6 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
    }
    .pulse-ring.blue { border-color: #3b82f6; }
    .pulse-core {
      width: 70px; height: 70px; background: #10b981; color: #020617;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; z-index: 2; box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
    }
    .pulse-core.bg-blue { background: #3b82f6; box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }

    @keyframes pulse-ring-v6 {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }

    .glass-chip-v6 {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 6px 16px; border-radius: 100px;
      font-size: 0.75rem; font-weight: 800; letter-spacing: 2px;
      display: inline-flex; align-items: center;
    }
    .status-dot-v6 { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #10b981; }

    .text-gradient-mixed-v6 {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-gradient-mixed-v6.blue-v6 {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #10b981 100%);
      -webkit-background-clip: text; background-clip: text;
    }

    /* --- IMPACT STATS --- */
    .impact-stat-v6 {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 30px; text-align: center;
      transition: 0.3s;
    }
    .impact-stat-v6:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-5px); }

    .circular-progress-v6 {
      width: 80px; height: 80px; margin: 0 auto; position: relative;
    }
    .circular-progress-v6 svg { transform: rotate(-90deg); }
    .circular-progress-v6 circle {
      fill: none; stroke-width: 8; stroke-linecap: round;
    }
    .circular-progress-v6 circle.bg { stroke: rgba(255, 255, 255, 0.1); }
    .circular-progress-v6 circle.fg {
      stroke: #10b981; stroke-dasharray: 283;
      stroke-dashoffset: calc(283 - (283 * var(--val)) / 100);
      filter: drop-shadow(0 0 5px #10b981);
    }
    .circular-progress-v6 circle.fg.blue { stroke: #3b82f6; filter: drop-shadow(0 0 5px #3b82f6); }
    .circular-progress-v6 circle.fg.violet { stroke: #8b5cf6; filter: drop-shadow(0 0 5px #8b5cf6); }

    .stat-icon {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; color: #10b981;
    }
    .stat-icon.blue { color: #3b82f6; }
    .stat-icon.violet { color: #8b5cf6; }

    .stat-val { font-size: 2rem; font-weight: 950; margin-top: 10px; }
    .stat-label { font-size: 0.75rem; font-weight: 800; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1px; }

    /* --- FINTECH SUMMARY --- */
    .fintech-summary-v6 {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
    .f-label { font-size: 0.65rem; font-weight: 900; color: rgba(255, 255, 255, 0.3); letter-spacing: 1px; margin-bottom: 5px; }
    .f-val { font-size: 1rem; font-weight: 800; color: #fff; }

    /* --- CTAs --- */
    .btn-cta-v6 {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      color: #fff; border: none; text-decoration: none; text-align: center;
      border-radius: 100px; font-weight: 950; letter-spacing: 1.5px;
      transition: all 0.4s ease;
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
    }
    .btn-cta-v6:hover { transform: translateY(-5px); filter: brightness(1.1); box-shadow: 0 30px 60px rgba(59, 130, 246, 0.4); }

    .btn-outline-v6 {
      background: transparent; border: 2px solid rgba(255, 255, 255, 0.2);
      color: #fff; text-decoration: none; text-align: center;
      border-radius: 100px; font-weight: 950; letter-spacing: 1.5px;
      transition: 0.4s;
    }
    .btn-outline-v6:hover { background: rgba(255, 255, 255, 0.05); border-color: #fff; transform: translateY(-5px); }

    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }

    @media (max-width: 767px) {
      .mission-card-v6 { padding: 30px !important; }
      .display-3 { font-size: 2.5rem; }
    }
  `]
})
export class OrderSuccessComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  orderId = '';
  amount = 0;
  childrenImpact = 0;
  doseImpact = 0;
  timestamp = '';
  validationId = '';
  method = 'upi';
  name = '';
  city = '';
  isDonation = false;
  planName = '';
  
  // Validation Sequence State
  isValidating = true;
  validationProgress = 0;
  currentStepText = '';
  currentStepIcon = '';
  currentStepColor = '';
  
  private upiSteps = [
    { progress: 33, text: 'Verifying UPI Transaction', icon: 'bi-bank', color: 'color-emerald' },
    { progress: 66, text: 'Securing Contribution Channel', icon: 'bi-shield-lock', color: 'color-teal' },
    { progress: 100, text: 'Activating Nutrition Intervention', icon: 'bi-heart-pulse', color: 'color-blue' }
  ];

  private codSteps = [
    { progress: 33, text: 'Verifying Distribution Address', icon: 'bi-geo-alt', color: 'color-emerald' },
    { progress: 66, text: 'Allocating Logistics Route', icon: 'bi-map', color: 'color-teal' },
    { progress: 100, text: 'Reserving Nutritional Kit', icon: 'bi-box-seam', color: 'color-blue' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'MAM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.amount = Number(params['amount']) || 0;
      this.method = params['method'] || 'upi';
      this.name = params['name'] || 'Supporter';
      this.city = params['city'] || 'Location';
      this.isDonation = params['isDonation'] === 'true';
      this.planName = params['planName'] || '';
      this.updateImpact();
    });

    this.timestamp = new Date().toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    this.validationId = Math.random().toString(36).substr(2, 12).toUpperCase();

    if (this.isBrowser) {
      this.startValidationSequence();
    }
  }

  private startValidationSequence() {
    let stepIndex = 0;
    const currentSteps = this.method === 'upi' ? this.upiSteps : this.codSteps;
    
    const runSequence = () => {
      if (stepIndex < currentSteps.length) {
        this.updateStep(currentSteps[stepIndex]);
        stepIndex++;
        setTimeout(runSequence, 1500); // 1.5s per step
      } else {
        setTimeout(() => {
          this.isValidating = false;
          this.triggerFinalAnimations();
        }, 800);
      }
    };

    setTimeout(runSequence, 500);
  }

  private updateStep(step: any) {
    this.validationProgress = step.progress;
    this.currentStepText = step.text;
    this.currentStepIcon = step.icon;
    this.currentStepColor = step.color;
    
    // Micro-animation for text
    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        gsap.fromTo('.step-text-v6', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
        gsap.fromTo('.icon-orb-v6',
          { scale: 0.5, rotate: -45 },
          { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }
        );
      });
    }
  }

  private triggerFinalAnimations() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        const tl = gsap.timeline();
        tl.from('.reveal-v6', {
          y: 50, opacity: 0, duration: 1.2, ease: 'power4.out'
        })
        .from('.impact-stat-v6', {
          scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)'
        }, '-=0.5')
        .from('.counter-v6', {
          textContent: 0, duration: 2, snap: { textContent: 1 }, ease: 'power2.out'
        }, '-=0.5');
      }, 100);
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  private updateImpact(): void {
    this.childrenImpact = Math.ceil(this.amount / 110);
    this.doseImpact = Math.ceil(this.amount / 22);
  }
}
