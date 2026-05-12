import { Component, ViewChild, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InquiryService } from '../../../services/inquiry.service';
import gsap from 'gsap';

@Component({
  selector: 'app-bulk-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bulk-page-premium position-relative overflow-hidden">
      <!-- Cinematic Background System -->
      <div class="bulk-mesh-bg"></div>
      <div class="glow-orb-purple"></div>
      <div class="glow-orb-emerald"></div>

      <div class="container position-relative z-3 py-150">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="bulk-content-box reveal-bulk">
              <div class="badge-premium-emerald-outline mb-4">
                <i class="bi bi-shield-check me-2"></i> Institutional Partnerships
              </div>
              <h1 class="display-3 fw-950 text-white mb-4 lh-1-1">
                Scaling Impact via <br>
                <span class="text-gradient-emerald">Bulk Interventions</span>
              </h1>
              <p class="lead text-white text-opacity-70 mb-5 max-w-500">
                A4MAM partners with NGOs, Clinical Centers, and Govt Organizations to deliver clinical-grade Spirulina at subsidized rates for large-scale malnutrition recovery programs.
              </p>

              <div class="impact-stats-grid mb-5">
                <div class="impact-stat-item">
                  <span class="stat-value">50+</span>
                  <span class="stat-label">Active Partners</span>
                </div>
                <div class="impact-stat-item">
                  <span class="stat-value">30%</span>
                  <span class="stat-label">Subsidized Rate</span>
                </div>
                <div class="impact-stat-item">
                  <span class="stat-value">12h</span>
                  <span class="stat-label">Response Time</span>
                </div>
              </div>

              <div class="partnership-benefits">
                <div class="benefit-row d-flex align-items-center gap-3 mb-3">
                  <div class="benefit-dot"></div>
                  <span class="text-white text-opacity-80 fw-600">Custom Formulation Support</span>
                </div>
                <div class="benefit-row d-flex align-items-center gap-3 mb-3">
                  <div class="benefit-dot"></div>
                  <span class="text-white text-opacity-80 fw-600">End-to-End Logistics & Distribution</span>
                </div>
                <div class="benefit-row d-flex align-items-center gap-3">
                  <div class="benefit-dot"></div>
                  <span class="text-white text-opacity-80 fw-600">Impact Data Analytics & Monitoring</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="inquiry-glass-card min-h-600 d-flex flex-column justify-content-center">
              
              <!-- Default Form State -->
              <div *ngIf="!isSuccess" class="form-state-container">
                <div class="glass-header text-center mb-4">
                  <h3 class="fw-900 text-white">Institutional Inquiry</h3>
                  <p class="small text-white text-opacity-50">Request a partnership proposal or bulk quotation</p>
                </div>
                
                <form class="inquiry-form-premium" (submit)="submitInquiry()" #bulkForm="ngForm">
                  <div class="row g-3">
                    <div class="col-12">
                      <div class="form-floating-premium">
                        <input type="text" class="form-control-premium" name="orgName" [(ngModel)]="formData.orgName" placeholder="Organization Name" required #orgName="ngModel" [class.is-invalid]="submitted && orgName.invalid">
                        <label>Organization Name</label>
                        <div class="text-danger mt-1 ms-2" style="font-size: 0.75rem" *ngIf="submitted && orgName.invalid">Organization name is required</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating-premium">
                        <input type="text" class="form-control-premium" name="contactPerson" [(ngModel)]="formData.contactPerson" placeholder="Contact Person" required #contactPerson="ngModel" [class.is-invalid]="submitted && contactPerson.invalid">
                        <label>Contact Person</label>
                        <div class="text-danger mt-1 ms-2" style="font-size: 0.75rem" *ngIf="submitted && contactPerson.invalid">Required</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating-premium">
                        <input type="email" class="form-control-premium" name="workEmail" [(ngModel)]="formData.workEmail" placeholder="Work Email" required #workEmail="ngModel" [class.is-invalid]="submitted && workEmail.invalid">
                        <label>Work Email</label>
                        <div class="text-danger mt-1 ms-2" style="font-size: 0.75rem" *ngIf="submitted && workEmail.invalid">Valid email required</div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating-premium">
                        <select class="form-control-premium-select" name="category" [(ngModel)]="formData.category">
                          <option value="School Feeding Program">School Feeding & Mid-Day Meal</option>
                          <option value="Government Health Program">Govt Health Program (NHM/ICDS)</option>
                          <option value="Community Health Center">Community Health Center</option>
                          <option value="CSR Initiative">Institutional CSR Partnership</option>
                          <option value="NGO / Relief Op">NGO / Disaster Relief Intervention</option>
                          <option value="Clinical Research">Clinical Research / Trials</option>
                        </select>
                        <label>Intervention Category</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating-premium">
                        <textarea class="form-control-premium" name="details" [(ngModel)]="formData.details" placeholder="Project Details" style="height: 120px;"></textarea>
                        <label>Project Details & Estimated Volume</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn-bulk-submit mt-4" [disabled]="isSubmitting">
                    <ng-container *ngIf="!isSubmitting">
                      <span>Submit Institutional Inquiry</span>
                      <i class="bi bi-arrow-right"></i>
                    </ng-container>
                    <ng-container *ngIf="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      <span>{{ loadingText }}</span>
                    </ng-container>
                  </button>
                </form>
              </div>

              <!-- Success State -->
              <div *ngIf="isSuccess" class="success-state-modern text-center py-4">
                <div class="success-icon-wrap mb-4 mx-auto d-flex align-items-center justify-content-center" style="width: 100px; height: 100px; background: rgba(16,185,129,0.1); border-radius: 50%; border: 1px solid rgba(16,185,129,0.3); box-shadow: 0 0 30px rgba(16,185,129,0.2);">
                  <i class="bi bi-shield-check text-emerald" style="font-size: 3.5rem; color: #10b981;"></i>
                </div>
                <h3 class="fw-900 text-white mb-3 text-glow-emerald">Inquiry Submitted</h3>
                <p class="text-white text-opacity-70 mb-4 px-3">Our mission partnerships team has safely received your request and will contact you shortly.</p>
                
                <div class="reference-badge p-3 mb-4" style="background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.15);">
                  <span class="d-block text-white text-opacity-50 small text-uppercase mb-1 fw-bold">Trace Reference ID</span>
                  <span class="d-block fs-5 fw-900 font-monospace" style="color: #34d399; letter-spacing: 2px;">{{ referenceId }}</span>
                </div>
                
                <button class="btn btn-outline-emerald rounded-pill px-4 py-2 mt-2" (click)="resetForm()" style="border: 1px solid rgba(16,185,129,0.5); color: #10b981; background: transparent; transition: 0.3s;" onmouseover="this.style.background='rgba(16,185,129,0.1)'" onmouseout="this.style.background='transparent'">
                  <i class="bi bi-arrow-repeat me-2"></i> Submit Another Request
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bulk-page-premium {
      background: #020617;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .py-150 { padding: 180px 0 120px; }
    .fw-950 { font-weight: 950; }
    .max-w-500 { max-width: 500px; }

    /* --- CINEMATIC ATMOSPHERE --- */
    .bulk-mesh-bg {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 40%);
      z-index: 1;
    }

    .glow-orb-purple {
      position: absolute; top: 10%; right: 5%; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      filter: blur(100px); z-index: 1; animation: float-v6 20s infinite alternate;
    }

    .glow-orb-emerald {
      position: absolute; bottom: -10%; left: -5%; width: 700px; height: 700px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
      filter: blur(120px); z-index: 1; animation: float-v6 25s infinite alternate-reverse;
    }

    @keyframes float-v6 {
      0% { transform: translate(0,0); }
      100% { transform: translate(50px, 50px); }
    }

    .text-gradient-emerald {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .badge-premium-emerald-outline {
      display: inline-flex; padding: 8px 20px; border-radius: 50px;
      border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05);
      color: #10b981; font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase;
    }

    .impact-stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    }

    .impact-stat-item {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px; padding: 25px 20px; text-align: center; backdrop-filter: blur(10px);
      transition: all 0.4s ease;
    }
    .impact-stat-item:hover { transform: translateY(-5px); border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); }

    .stat-value { display: block; font-size: 2rem; font-weight: 950; color: #fff; line-height: 1; margin-bottom: 8px; }
    .stat-label { display: block; font-size: 0.7rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }

    .benefit-dot { width: 8px; height: 8px; background: #10b981; border-radius: 2px; box-shadow: 0 0 10px #10b981; }

    /* --- GLASS CARD FORM --- */
    .inquiry-glass-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.15); padding: 50px; border-radius: 40px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
    }

    .form-floating-premium { position: relative; margin-bottom: 5px; }
    .form-control-premium, .form-control-premium-select {
      width: 100%; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 28px 20px 10px; border-radius: 20px; color: #fff; font-size: 1rem; font-weight: 600;
      transition: all 0.3s ease;
    }
    .form-control-premium-select { 
      appearance: none; 
      cursor: pointer; 
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2310b981' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 20px center;
      color-scheme: dark; /* Helps on some browsers to theme the dropdown list */
    }

    .form-control-premium-select option {
      background-color: #0f172a;
      color: #fff;
      padding: 15px;
    }

    .form-floating-premium label {
      position: absolute; top: 12px; left: 20px; font-size: 0.65rem; font-weight: 800;
      color: #10b981; text-transform: uppercase; letter-spacing: 1px; pointer-events: none;
    }

    .form-control-premium:focus, .form-control-premium-select:focus {
      background: rgba(255, 255, 255, 0.08); border-color: #10b981; outline: none;
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);
    }

    .btn-bulk-submit {
      width: 100%; padding: 22px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none; border-radius: 20px; color: #fff; font-weight: 900; font-size: 1rem;
      display: flex; justify-content: center; align-items: center; gap: 15px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer;
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
    }

    .btn-bulk-submit:hover:not(:disabled) {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 30px 60px rgba(16, 185, 129, 0.4);
      filter: brightness(1.1);
    }

    .btn-bulk-submit:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(0.5); }

    @media (max-width: 991px) {
      .inquiry-glass-card { padding: 30px; }
      .py-150 { padding: 120px 0 80px; }
      .impact-stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BulkOrdersComponent implements AfterViewInit {
  @ViewChild('bulkForm') bulkForm!: NgForm;

  private isBrowser: boolean;
  submitted = false;
  isSubmitting = false;
  isSuccess = false;
  loadingText = 'Processing Inquiry...';
  referenceId = '';

  formData = {
    orgName: '',
    contactPerson: '',
    workEmail: '',
    category: 'School Feeding Program',
    details: ''
  };

  constructor(
    private inquiryService: InquiryService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      gsap.from('.reveal-bulk', {
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
      gsap.from('.inquiry-glass-card', {
        x: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power3.out'
      });
    });
  }

  submitInquiry() {
    this.submitted = true;

    if (this.bulkForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.loadingText = 'Submitting Institutional Inquiry...';

    setTimeout(() => {
      this.loadingText = 'Verifying Organization Details...';
    }, 1000);

    setTimeout(() => {
      this.loadingText = 'Routing to Mission Partnerships Team...';
      
      const inquiryData = {
        name: this.formData.contactPerson,
        email: this.formData.workEmail,
        organization: this.formData.orgName,
        message: `[${this.formData.category}] ${this.formData.details}`,
        type: 'Bulk Order'
      };

      this.inquiryService.addInquiry(inquiryData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isSubmitting = false;
            this.isSuccess = true;
            this.referenceId = response.data.referenceId || response.data._id;
            
            setTimeout(() => {
              gsap.fromTo('.success-state-modern', 
                { opacity: 0, scale: 0.95, y: 10 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }
              );
              gsap.fromTo('.success-icon-wrap',
                { scale: 0.5, opacity: 0, rotation: -30 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.1 }
              );
              gsap.fromTo('.reference-badge',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.4 }
              );
            }, 50);
          }
        },
        error: (err: any) => {
          this.isSubmitting = false;
          alert(err.error?.message || 'Failed to transmit institutional mission. Please check connection.');
        }
      });
    }, 2500);
  }

  resetForm() {
    this.submitted = false;
    this.isSuccess = false;
    this.formData = {
      orgName: '',
      contactPerson: '',
      workEmail: '',
      category: 'School Feeding Program',
      details: ''
    };
    
    setTimeout(() => {
      gsap.fromTo('.form-state-container',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }, 50);
  }
}
