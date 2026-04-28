import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bulk-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bulk-page-premium position-relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="bulk-mesh-bg"></div>
      <div class="glow-orb-purple"></div>
      <div class="glow-orb-emerald"></div>

      <div class="container position-relative z-3 py-150">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="bulk-content-box">
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
            <div class="inquiry-glass-card">
              <div class="glass-header text-center mb-4">
                <h3 class="fw-900 text-white">Institutional Inquiry</h3>
                <p class="small text-white text-opacity-50">Request a partnership proposal or bulk quotation</p>
              </div>
              
              <form class="inquiry-form-premium" (submit)="submitInquiry()">
                <div class="row g-3">
                  <div class="col-12">
                    <div class="form-floating-premium">
                      <input type="text" class="form-control-premium" placeholder="Organization Name" required>
                      <label>Organization Name</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating-premium">
                      <input type="text" class="form-control-premium" placeholder="Contact Person" required>
                      <label>Contact Person</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating-premium">
                      <input type="email" class="form-control-premium" placeholder="Work Email" required>
                      <label>Work Email</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating-premium">
                      <select class="form-control-premium-select">
                        <option>School Feeding Program</option>
                        <option>Community Health Center</option>
                        <option>CSR Initiative</option>
                        <option>NGO / Relief Op</option>
                      </select>
                      <label>Intervention Category</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating-premium">
                      <textarea class="form-control-premium" placeholder="Project Details" style="height: 120px;"></textarea>
                      <label>Project Details & Estimated Volume</label>
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn-bulk-submit mt-4">
                  <span>Send Partnership Request</span>
                  <i class="bi bi-arrow-right"></i>
                </button>
              </form>
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
    }

    .py-150 { padding: 150px 0; }
    .fw-950 { font-weight: 950; }
    .max-w-500 { max-width: 500px; }

    .bulk-mesh-bg {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 40%);
      z-index: 1;
    }

    .glow-orb-purple {
      position: absolute;
      top: 20%;
      right: 15%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 1;
    }

    .glow-orb-emerald {
      position: absolute;
      bottom: 10%;
      left: 10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      filter: blur(100px);
      z-index: 1;
    }

    .text-gradient-emerald {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .badge-premium-emerald-outline {
      display: inline-flex;
      padding: 8px 16px;
      border-radius: 50px;
      border: 1px solid rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.05);
      color: #10b981;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .impact-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .stat-value {
      display: block;
      font-size: 1.8rem;
      font-weight: 900;
      color: #10b981;
      line-height: 1;
      margin-bottom: 5px;
    }

    .stat-label {
      display: block;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      font-weight: 700;
    }

    .benefit-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 2px;
      box-shadow: 0 0 10px #10b981;
    }

    /* GLASS CARD FORM */
    .inquiry-glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 50px;
      border-radius: 40px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
    }

    .form-floating-premium {
      position: relative;
      margin-bottom: 20px;
    }

    .form-control-premium {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 25px 20px 10px;
      border-radius: 16px;
      color: #fff;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .form-control-premium-select {
       width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 25px 20px 10px;
      border-radius: 16px;
      color: #fff;
      font-size: 0.95rem;
      appearance: none;
    }

    .form-floating-premium label {
      position: absolute;
      top: 10px;
      left: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      color: #10b981;
      text-transform: uppercase;
      pointer-events: none;
    }

    .form-control-premium:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: #10b981;
      outline: none;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
    }

    .btn-bulk-submit {
      width: 100%;
      padding: 20px;
      background: #10b981;
      border: none;
      border-radius: 16px;
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .btn-bulk-submit:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
      background: #059669;
    }

    @media (max-width: 991px) {
      .inquiry-glass-card { padding: 30px; }
      .py-150 { padding: 100px 0; }
    }
  `]
})
export class BulkOrdersComponent {
  submitInquiry() {
    alert('Strategic Partnership Request Received! Our Institutional Support team will contact you with a formal proposal within 12-24 hours.');
  }
}
