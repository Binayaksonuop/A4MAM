import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found-wrapper">
      <div class="not-found-glow g1"></div>
      <div class="not-found-glow g2"></div>
      <div class="container position-relative z-3 text-center">
        <div class="error-code">404</div>
        <h1 class="display-4 fw-950 text-white mb-3">Page Not Found</h1>
        <p class="lead text-white text-opacity-60 mb-5 mx-auto" style="max-width: 500px;">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a routerLink="/" class="btn btn-404-home">
            <i class="bi bi-house-door me-2"></i>Back to Home
          </a>
          <a routerLink="/contact" class="btn btn-404-contact">
            <i class="bi bi-envelope me-2"></i>Contact Us
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #020617;
      position: relative;
      overflow: hidden;
      padding: 180px 20px 100px 20px;
    }
    .not-found-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      z-index: 1;
    }
    .g1 {
      width: 500px; height: 500px;
      background: rgba(16, 185, 129, 0.12);
      top: 5%; right: 5%;
    }
    .g2 {
      width: 400px; height: 400px;
      background: rgba(59, 130, 246, 0.08);
      bottom: 5%; left: 10%;
    }
    .error-code {
      font-size: clamp(6rem, 15vw, 12rem);
      font-weight: 950;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 2rem;
      letter-spacing: -0.05em;
      filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.2));
    }
    .btn-404-home {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      padding: 14px 32px;
      border-radius: 100px;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      transition: all 0.4s ease;
    }
    .btn-404-home:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
      color: #fff;
    }
    .btn-404-contact {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      padding: 14px 32px;
      border-radius: 100px;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s ease;
    }
    .btn-404-contact:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      transform: translateY(-3px);
    }
  `]
})
export class NotFoundComponent {}
