import { Component, OnInit, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import gsap from 'gsap';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-obsidian-v6">
      <div class="aura-container">
        <div class="aura-orb aura-emerald"></div>
        <div class="aura-orb aura-navy"></div>
      </div>
      <div class="tech-grid-overlay"></div>
      
      <div class="login-state min-vh-100 d-flex align-items-center justify-content-center position-relative z-3">
        <div class="login-glass-card p-5 rounded-5 reveal-login">
          <div class="text-center mb-5">
            <div class="shield-icon-wrapper mx-auto mb-4">
              <i class="bi bi-shield-lock-fill text-emerald fs-1"></i>
            </div>
            <h2 class="text-white fw-950 mb-2">Mission Control</h2>
            <p class="text-white text-opacity-50 small text-uppercase letter-spacing-1">Authorized Access Only</p>
          </div>

          <form (ngSubmit)="handleLogin()">
            <div class="form-floating-premium mb-3">
              <input type="email" class="form-control-premium" [(ngModel)]="email" name="email" placeholder="Email" required>
              <label>Email Address</label>
            </div>

            <div class="form-floating-premium mb-4 position-relative">
              <input [type]="showPassword ? 'text' : 'password'" class="form-control-premium pe-5" [(ngModel)]="password" name="password" placeholder="Passcode" required>
              <label>Password</label>
              <i class="bi eye-toggle position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer" 
                 [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'" 
                 (click)="togglePassword()"></i>
            </div>

            <div class="demo-creds text-center mb-4 text-white text-opacity-50 small">
              <i class="bi bi-info-circle me-1"></i> Admin Login: <strong class="text-emerald">admin&#64;a4mam.com / Admin&#64;2026</strong>
            </div>

            <div class="error-inline mb-4 text-center text-danger small fw-bold" *ngIf="loginError">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ loginError }}
            </div>

            <button type="submit" class="btn-login-ultra w-100 py-3 rounded-pill" [disabled]="isLoading">
              <span *ngIf="!isLoading">ACCESS CLINICAL CONSOLE <i class="bi bi-arrow-right-circle-fill ms-2"></i></span>
              <span *ngIf="isLoading"><i class="bi bi-hourglass-split anim-spin me-2"></i> AUTHENTICATING...</span>
            </button>
          </form>
          
          <div class="text-center mt-5">
            <span class="text-white text-opacity-20 x-small font-monospace">NODE_ID: MAM_CMS_V6</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-obsidian-v6 { background: #020617; min-height: 100vh; color: #fff; overflow: hidden; position: relative; }
    .aura-container { position: absolute; inset: 0; overflow: hidden; z-index: 1; }
    .aura-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.3; }
    .aura-emerald { width: 60vw; height: 60vh; background: #10b981; top: -10%; right: -10%; }
    .aura-navy { width: 50vw; height: 50vh; background: #3b82f6; bottom: -10%; left: -10%; }
    .tech-grid-overlay { position: absolute; inset: 0; z-index: 2; opacity: 0.05; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 30px 30px; }
    .login-state { padding-top: 120px; }
    
    .login-glass-card { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; max-width: 440px; }
    .shield-icon-wrapper { width: 70px; height: 70px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
    
    .form-floating-premium { position: relative; }
    .form-control-premium { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 25px 20px 10px; border-radius: 16px; color: #fff; }
    .form-floating-premium label { position: absolute; top: 12px; left: 20px; font-size: 0.7rem; font-weight: 800; color: #10b981; text-transform: uppercase; }
    
    .btn-login-ultra { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; border: none; font-weight: 900; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }
    .btn-login-ultra:hover { transform: translateY(-3px); }
    .x-small { font-size: 0.7rem; }
    .text-emerald { color: #10b981; }
    .cursor-pointer { cursor: pointer; transition: color 0.3s ease; }
    .eye-toggle { color: rgba(255, 255, 255, 0.5); font-size: 1.2rem; }
    .eye-toggle:hover { color: #10b981; }
    .anim-spin { display: inline-block; animation: spin 1.5s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]

})
export class AdminLoginComponent implements OnInit {
  private isBrowser: boolean;
  email = '';
  password = '';
  showPassword = false;
  loginError = '';
  isLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private authService: AuthService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.authService.isLoggedIn().subscribe(loggedIn => {
        if (loggedIn) {
          this.router.navigate(['/admin/dashboard']);
        }
      });
      setTimeout(() => this.animateLogin(), 100);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    if (!this.email || !this.password) {
      this.loginError = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Connection failed. Please check if the backend is running.';
        console.error('Login error:', err);
      }
    });
  }

  private animateLogin() {
    this.zone.runOutsideAngular(() => {
      gsap.fromTo('.reveal-login',
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    });
  }
}
