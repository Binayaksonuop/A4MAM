import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ProductService, AdminProduct } from '../../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shop-premium-listing">
      
      <!-- HERO BANNER (PREMIUM DARK) -->
      <section class="shop-hero-premium position-relative overflow-hidden">
        <div class="shop-hero-mesh"></div>
        <div class="container position-relative z-2">
          <div class="row min-vh-40 align-items-center py-5">
            <div class="col-lg-8 mx-auto text-center">
              <span class="badge-premium-emerald mb-3 d-inline-block">The A4MAM Store</span>
              <h1 class="display-3 fw-900 text-white mb-3 letter-spacing-1">Scientific <span class="text-gradient-emerald">Nutrition</span></h1>
              <p class="lead text-white text-opacity-70 mx-auto" style="max-width: 600px;">
                Directly supporting the eradication of malnutrition through premium, 
                bio-available Spirulina interventions for children and mothers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="container py-5 position-relative z-2">
        
        <!-- Premium Filter Bar -->
        <div class="d-flex justify-content-center gap-2 mb-5 flex-wrap filter-container-glass p-2 rounded-pill mx-auto" style="max-width: fit-content;" *ngIf="products.length > 0">
          <button class="btn filter-pill" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All Products</button>
          <button class="btn filter-pill" [class.active]="activeFilter === 'kids'" (click)="setFilter('kids')">For Kids</button>
          <button class="btn filter-pill" [class.active]="activeFilter === 'maternal'" (click)="setFilter('maternal')">Maternal Care</button>
          <button class="btn filter-pill" [class.active]="activeFilter === 'powder'" (click)="setFilter('powder')">Pure Powder</button>
          <button class="btn filter-pill" [class.active]="activeFilter === 'kit'" (click)="setFilter('kit')">Complete Kits</button>
        </div>

        <!-- Empty State -->
        <div class="text-center py-5" *ngIf="products.length === 0">
          <i class="bi bi-box-seam text-emerald" style="font-size: 3rem;"></i>
          <h3 class="text-white fw-bold mt-3">No Products Available</h3>
          <p class="text-white text-opacity-50">Please add products from the Admin Panel.</p>
        </div>

        <!-- Premium Product Grid -->
        <div class="row g-4 mb-5" *ngIf="products.length > 0">
          <div class="col-lg-4 col-md-6" *ngFor="let product of filteredProducts; trackBy: trackByProductId">
            <div class="product-glass-card shadow-lg h-100 d-flex flex-column" [class.opacity-50]="product.status === 'Out of Stock'">
              <div class="product-img-glass-wrap position-relative">
                <span class="product-badge-float" *ngIf="product.status === 'Out of Stock'" style="background: #ef4444;">Out of Stock</span>
                <span class="product-badge-float" *ngIf="product.status === 'In Stock'" style="background: linear-gradient(135deg, #10b981, #059669);">In Stock</span>
                
                <img [src]="product.imageUrl" [alt]="product.name" class="img-fluid product-main-img" onerror="this.src='assets/images/logo_mam.png'">
                <div class="img-shimmer"></div>
              </div>
              
              <div class="product-body-glass p-4 d-flex flex-column flex-grow-1">
                <h4 class="text-white fw-bold mb-2">{{ product.name }}</h4>
                <p class="text-white text-opacity-50 small mb-4 flex-grow-1 lh-base">{{ product.description || 'Premium Spirulina product for clinical intervention.' }}</p>
                
                <div class="d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-10 mt-auto">
                  <div class="price-wrap">
                    <span class="text-white text-opacity-40 x-small d-block mb-1">UNIT PRICE</span>
                    <span class="text-emerald fs-4 fw-900 letter-spacing-1">₹{{ product.price }}</span>
                  </div>
                  
                  <div class="action-buttons d-flex gap-2">
                    <a [routerLink]="['/shop', product.slug || product.id]" class="btn btn-view-premium">
                      <i class="bi bi-eye"></i>
                    </a>
                    <button class="btn btn-add-premium" (click)="addToCart(product)" [disabled]="product.status === 'Out of Stock'">
                      <i class="bi bi-cart-plus-fill me-2"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk/NGO CTA Bar (PREMIUM GLASS) -->
        <div class="bulk-order-premium-bar p-5 rounded-5 mt-5 position-relative overflow-hidden">
          <div class="bulk-mesh"></div>
          <div class="row align-items-center position-relative z-2">
            <div class="col-lg-8">
              <h2 class="display-5 fw-950 text-white mb-3">Institutional & <span class="text-gradient-emerald">Bulk Supply</span></h2>
              <p class="lead text-white text-opacity-70 mb-0">
                Are you an NGO, Hospital, or CSR initiative? We offer heavily 
                subsidized rates for large-scale nutritional interventions.
              </p>
            </div>
            <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <a routerLink="/shop/bulk" class="btn btn-emerald-lg px-5 py-3 rounded-pill fw-bold hover-scale">
                Inquire for Bulk <i class="bi bi-arrow-right-circle-fill ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-premium-listing { background: #0a0f1e; min-height: 100vh; }
    .shop-hero-premium { background: linear-gradient(135deg, #020617 0%, #0a1f14 100%); padding-top: 60px; }
    .shop-hero-mesh { position: absolute; inset: 0; background: radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.15), transparent 70%); pointer-events: none; }
    .badge-premium-emerald { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 6px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
    .filter-container-glass { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
    .filter-pill { border: none; padding: 10px 24px; border-radius: 50px; color: rgba(255, 255, 255, 0.6); font-weight: 700; font-size: 0.85rem; transition: all 0.3s ease; }
    .filter-pill.active { background: #10b981; color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); }
    .filter-pill:hover:not(.active) { background: rgba(255, 255, 255, 0.1); color: white; }
    .product-glass-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 28px; overflow: hidden; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); backdrop-filter: blur(12px); }
    .product-glass-card:hover { transform: translateY(-12px); border-color: rgba(16, 185, 129, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }
    .product-img-glass-wrap { height: 240px; background: rgba(255, 255, 255, 0.02); display: flex; align-items: center; justify-content: center; padding: 30px; overflow: hidden; }
    .product-main-img { max-height: 100%; object-fit: contain; filter: drop-shadow(0 15px 30px rgba(0,0,0,0.5)); transition: transform 0.5s ease; }
    .product-glass-card:hover .product-main-img { transform: scale(1.1) rotate(2deg); }
    .product-badge-float { position: absolute; top: 15px; right: 15px; color: white; font-size: 0.65rem; padding: 4px 12px; border-radius: 50px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; z-index: 2; }
    .btn-view-premium { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; border-radius: 14px; padding: 8px 14px; transition: all 0.2s; }
    .btn-view-premium:hover { background: rgba(255, 255, 255, 0.15); color: white; }
    .btn-add-premium { background: #10b981; color: white; border: none; border-radius: 14px; padding: 8px 20px; font-weight: 800; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.2s; }
    .btn-add-premium:hover:not(:disabled) { background: #059669; transform: scale(1.05); box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); }
    .btn-add-premium:disabled { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.3); cursor: not-allowed; box-shadow: none; }
    .bulk-order-premium-bar { background: rgba(16, 185, 129, 0.07); border: 1px solid rgba(16, 185, 129, 0.2); backdrop-filter: blur(10px); }
    .bulk-mesh { position: absolute; inset: 0; background: radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.15), transparent 60%); }
    .btn-emerald-lg { background: #10b981; color: white; border: none; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); }
    .text-gradient-emerald { background: linear-gradient(90deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hover-scale:hover { transform: scale(1.03); }
    .letter-spacing-1 { letter-spacing: 1px; }
    .x-small { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; }
  `]
})
export class ShopListingComponent implements OnInit, OnDestroy {
  products: AdminProduct[] = [];
  filteredProducts: AdminProduct[] = [];
  activeFilter = 'all';
  private subscription: Subscription | null = null;

  constructor(private cartService: CartService, private productService: ProductService) {}

  ngOnInit(): void {
    this.subscription = this.productService.getProducts().subscribe(prods => {
      // Filter out drafts from public view
      this.products = prods.filter(p => p.status !== 'Draft');
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setFilter(category: string): void {
    this.activeFilter = category;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === this.activeFilter);
    }
  }

  trackByProductId(index: number, product: AdminProduct): string {
    return product.id;
  }

  addToCart(product: AdminProduct): void {
    if (product.status === 'Out of Stock') return;
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    });
  }
}
