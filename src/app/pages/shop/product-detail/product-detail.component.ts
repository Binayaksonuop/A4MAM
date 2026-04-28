import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  pricePerBox?: number;
  category: string;
  images: string[];
  nutrients: { name: string; value: string; icon: string }[];
  whoIsItFor: string;
  dosageGuide: { level: string; dose: string; desc: string }[];
  weightOptions?: string[];
  packSizes?: string[];
  bundleContents?: string[];
  impactStatement: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-detail-page" *ngIf="product">
      <div class="container py-5 mt-5">
        <div class="row g-5">
          <!-- Left: Images Carousel -->
          <div class="col-lg-6">
            <div class="product-gallery">
              <div class="main-img-box rounded-4 overflow-hidden mb-3 border border-slate-100 bg-white d-flex align-items-center justify-content-center" style="height: 500px;">
                <img [src]="activeImage" [alt]="product.name" class="img-fluid" style="max-height: 100%; object-fit: contain;">
              </div>
              <div class="thumb-grid d-flex gap-3">
                <div 
                  class="thumb-box rounded-3 overflow-hidden cursor-pointer border-2"
                  [class.border-emerald]="activeImage === img"
                  [style.border-color]="activeImage === img ? '#10b981' : 'transparent'"
                  *ngFor="let img of product.images"
                  (click)="activeImage = img">
                  <img [src]="img" [alt]="product.name" class="img-fluid" style="width: 80px; height: 80px; object-fit: cover;">
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Info -->
          <div class="col-lg-6">
            <div class="product-info-header mb-4">
              <h6 class="text-emerald fw-800 text-uppercase letter-spacing-1 mb-2">{{ product.category }}</h6>
              <h1 class="display-5 fw-950 text-slate-800 mb-2">{{ product.name }}</h1>
              <p class="lead text-slate-600 mb-3">{{ product.tagline }}</p>
              
              <div class="price-box d-flex align-items-baseline gap-3 mb-4">
                <span class="price-main fw-950 text-slate-800 fs-2">₹{{ product.price }}</span>
                <span class="text-muted" *ngIf="product.pricePerBox">/ bar or ₹{{ product.pricePerBox }} per box</span>
              </div>

              <!-- Options (Weight/Size) -->
              <div class="options-box mb-4" *ngIf="product.weightOptions || product.packSizes">
                <span class="form-label fw-800 small text-uppercase text-slate-400 d-block mb-2">Select Option</span>
                <div class="d-flex gap-2">
                  <button 
                    *ngFor="let opt of (product.weightOptions || product.packSizes)"
                    class="btn btn-outline-slate rounded-pill px-4 fw-700"
                    [class.active]="activeOption === opt"
                    (click)="activeOption = opt">
                    {{ opt }}
                  </button>
                </div>
              </div>

              <!-- Impact Note -->
              <div class="impact-alert p-3 rounded-4 mb-4">
                <div class="d-flex gap-3 align-items-center">
                  <div class="icon-pulse-emerald"><i class="bi bi-heart-fill"></i></div>
                  <p class="mb-0 fw-700 text-slate-800 small">
                    Every purchase directly funds Spirulina supplementation for a child in need.
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-3 mb-5">
                <div class="quantity-selector d-flex align-items-center rounded-pill border border-slate-200 bg-white">
                  <button class="btn btn-link text-slate-800 text-decoration-none" (click)="updateQty(-1)"><i class="bi bi-dash fs-4"></i></button>
                  <span class="px-3 fw-900 fs-5">{{ quantity }}</span>
                  <button class="btn btn-link text-slate-800 text-decoration-none" (click)="updateQty(1)"><i class="bi bi-plus fs-4"></i></button>
                </div>
                <button class="btn btn-emerald-lg flex-grow-1 py-3 fw-900 rounded-pill" (click)="addToCart()">Add to Cart</button>
              </div>

              <!-- Trust Badges -->
              <div class="trust-badges d-flex gap-4 opacity-60">
                <div class="badge-item text-center">
                  <i class="bi bi-shield-check fs-3 mb-1 d-block"></i>
                  <span class="small fw-700">ISO Certified</span>
                </div>
                <div class="badge-item text-center">
                  <i class="bi bi-flower1 fs-3 mb-1 d-block"></i>
                  <span class="small fw-700">100% Organic</span>
                </div>
                <div class="badge-item text-center">
                  <i class="bi bi-activity fs-3 mb-1 d-block"></i>
                  <span class="small fw-700">Clinical Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Specs -->
        <div class="row mt-5 pt-5 border-top">
          <div class="col-lg-8">
            <h3 class="fw-950 mb-4">Scientific Nutrition</h3>
            <p class="text-slate-600 mb-5 fs-5 lh-lg">{{ product.description }}</p>
            
            <div class="row g-4 mb-5">
              <div class="col-md-6" *ngFor="let nutrient of product.nutrients">
                <div class="nutrient-card p-3 rounded-4 bg-slate-50 d-flex align-items-center gap-3">
                  <div class="nutrient-icon bg-white text-emerald rounded-3 shadow-sm d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i [class]="nutrient.icon" class="fs-4"></i>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-900">{{ nutrient.name }}</h6>
                    <p class="mb-0 text-muted small">{{ nutrient.value }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="dosage-card p-4 rounded-4 border border-slate-100 bg-white">
              <h5 class="fw-950 mb-3">Dosage Guide</h5>
              <div class="dosage-list">
                <div class="dosage-item mb-3 pb-3 border-bottom last-child-no-border" *ngFor="let d of product.dosageGuide">
                  <h6 class="fw-800 text-emerald mb-1">{{ d.level }}</h6>
                  <p class="mb-1 fw-900 small">{{ d.dose }}</p>
                  <p class="mb-0 text-muted x-small">{{ d.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page { background: #fff; }
    .btn-emerald-lg {
      background: #10b981;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
    }
    .btn-emerald-lg:hover {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
    }
    .impact-alert {
      background: #f0fdf4;
      border: 1px solid #dcfce7;
    }
    .icon-pulse-emerald {
      width: 40px; height: 40px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-emerald 2s infinite;
    }
    @keyframes pulse-emerald {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .nutrient-card { border: 1px solid transparent; transition: all 0.3s ease; }
    .nutrient-card:hover { border-color: #10b981; background: white; shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .last-child-no-border:last-child { border-bottom: none !important; }
    .x-small { font-size: 0.75rem; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: ProductDetail | undefined;
  activeImage = '';
  activeOption = '';
  quantity = 1;

  private products: ProductDetail[] = [
    {
      id: 'cb1',
      name: 'Chicky Bar (60g)',
      slug: 'chicky-bars',
      tagline: 'The Ultimate Weapon Against Stunting',
      description: 'Chicky Bars are specially formulated peanut-based nutrition bars designed for children suffering from MAM (Moderate Acute Malnutrition). Packed with Spirulina, vitamins, and minerals.',
      price: 25,
      pricePerBox: 600,
      category: 'Kids Nutrition',
      images: ['assets/images/chicky_bars_new.png', 'assets/images/nutrition.png'],
      nutrients: [
        { name: 'Protein', value: '12g per bar', icon: 'bi bi-lightning-fill' },
        { name: 'Spirulina', value: '500mg', icon: 'bi bi-leaf-fill' },
        { name: 'Vitamin A', value: '100% RDA', icon: 'bi bi-eye-fill' },
        { name: 'Iron', value: '8mg', icon: 'bi bi-droplet-fill' }
      ],
      whoIsItFor: 'Children aged 6 months to 5 years needing nutritional support.',
      dosageGuide: [
        { level: 'Prevention', dose: '1/2 bar daily', desc: 'For healthy children as a snack.' },
        { level: 'At Risk', dose: '1 bar daily', desc: 'For children with borderline WAZ scores.' },
        { level: 'MAM', dose: '2 bars daily', desc: 'As part of a 30-day intervention.' }
      ],
      impactStatement: 'One box provides a 15-day recovery course for a MAM child.'
    },
    {
      id: 'sp1',
      name: 'Spirulina Powder',
      slug: 'powder',
      tagline: 'Nature\'s Most Nutrient-Dense Superfood',
      description: 'Our medical-grade Spirulina powder is sun-dried and cold-processed to preserve all vital nutrients. Perfect for mixing into smoothies, juices, or water.',
      price: 450,
      category: 'Pure Spirulina',
      images: ['assets/images/spirulina_2.png', 'assets/images/spirulina_superfood.png'],
      weightOptions: ['100g', '250g', '500g'],
      nutrients: [
        { name: 'Protein', value: '65% by weight', icon: 'bi bi-lightning-fill' },
        { name: 'Beta-Carotene', value: 'High concentration', icon: 'bi bi-sun-fill' },
        { name: 'B-Vitamins', value: 'B1, B2, B6, B12', icon: 'bi bi-capsule' },
        { name: 'Phycocyanin', value: 'Powerful Antioxidant', icon: 'bi bi-shield-plus' }
      ],
      whoIsItFor: 'Adults, Athletes, and Seniors looking for immune support.',
      dosageGuide: [
        { level: 'Maintenance', dose: '1-2g daily', desc: 'Mix into morning juice.' },
        { level: 'Immune Boost', dose: '3-5g daily', desc: 'During periods of high stress.' },
        { level: 'Recovery', dose: '5-10g daily', desc: 'Post-illness or intense training.' }
      ],
      impactStatement: 'Funds 10g of free Spirulina for community distribution.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.product = this.products.find(p => p.slug === slug);
      if (this.product) {
        this.activeImage = this.product.images[0];
        this.activeOption = this.product.weightOptions ? this.product.weightOptions[0] : (this.product.packSizes ? this.product.packSizes[0] : '');
      }
    });
  }

  updateQty(delta: number): void {
    const newQty = this.quantity + delta;
    if (newQty >= 1 && newQty <= 99) {
      this.quantity = newQty;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.quantity,
        image: this.product.images[0],
        option: this.activeOption
      });
      // Optional: Visual feedback
    }
  }
}
