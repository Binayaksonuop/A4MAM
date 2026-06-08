import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  NgZone,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Title, Meta } from '@angular/platform-browser';



interface ProductDetail {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  description: string;
  benefits: string[];
  includes: string[];
  badge: string;
  nutrition: {
    protein: number;
    iron: number;
    absorption: number;
  }
}

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShopDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  productId: string = '';
  product: ProductDetail | null = null;
  isLoading: boolean = true;
  isAdded: boolean = false;
  selectedQty: number = 1;
  lastAddedQty: number = 1;

  // Nutritional Display Values (Animated)
  proteinDisplay = 0;
  ironDisplay = 0;
  absorptionDisplay = 0;



  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private zone: NgZone,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const rawSlug = params['slug'] || '';
      const normalizedSlug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      this.isLoading = true;
      
      this.productService.getProducts().subscribe(products => {
        let found: any = null;
        
        if (products && products.length > 0) {
          found = products.find(p => {
            const pSlug = (p.slug || '').toLowerCase();
            const pNameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return pSlug === normalizedSlug || 
                   p.id === rawSlug || 
                   pNameSlug === normalizedSlug ||
                   p._id === rawSlug;
          });
        }
        
        if (found) {
          this.product = {
            id: found.id || found._id,
            title: found.name,
            subtitle: found.subtitle || 'Premium Nutritional Support',
            price: found.price,
            image: found.imageUrl,
            badge: found.badge || (found.status === 'Out of Stock' ? 'Sold Out' : 'Available'),
            description: found.description || 'A premium nutritional intervention product.',
            benefits: found.benefits || [
              'Provides essential micronutrients.',
              'Supports overall health and immunity.',
              'Highly bio-available formulation.'
            ],
            includes: found.includes || ['1x Premium Package'],
            nutrition: found.nutrition || { protein: 80, iron: 85, absorption: 90 }
          };
        } else {
          this.product = null;
        }
        
        if (this.product) {
          this.titleService.setTitle(`${this.product.title} | A4MAM Shop`);
          this.metaService.updateTag({ name: 'description', content: this.product.description });
          this.metaService.updateTag({ property: 'og:title', content: this.product.title });
          this.metaService.updateTag({ property: 'og:description', content: this.product.description });
          this.metaService.updateTag({ property: 'og:image', content: this.product.image });

          if (this.isBrowser) {
            setTimeout(() => {
              this.initHeroAnimation();
              this.initScrollAnimations();
            }, 100);
          }
        }
        
        this.isLoading = false;
      });
    });
  }

  ngAfterViewInit(): void {
    // Scroll animations are now initialized after data loads
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }

  private initHeroAnimation(): void {
    if (!this.isBrowser) return;
    
    // Set initial state via GSAP to avoid flashes, then animate
    gsap.from('.product-hero-visual-v6', {
      x: -30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.product-info-reveal-v6 > *', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all' // Crucial: remove GSAP styles after animation
    });

    // Levitation Animation
    gsap.to('.product-img-v6', {
      y: -15,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }

  private initScrollAnimations(): void {
    // 2. Nutritional Stats Counter
    if (this.product) {
      const stats = { p: 0, i: 0, a: 0 };
      gsap.to(stats, {
        p: this.product.nutrition.protein,
        i: this.product.nutrition.iron,
        a: this.product.nutrition.absorption,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.nutrition-grid-v6',
          start: 'top 85%'
        },
        onUpdate: () => {
          this.zone.run(() => {
            this.proteinDisplay = Math.round(stats.p);
            this.ironDisplay = Math.round(stats.i);
            this.absorptionDisplay = Math.round(stats.a);
          });

          // Update rings directly for performance
          document.querySelectorAll('.nutrition-ring-path').forEach((ring: any, index) => {
            const val = index === 0 ? stats.p : index === 1 ? stats.i : stats.a;
            ring.style.strokeDasharray = `${val}, 100`;
          });
        }
      });
    }

    // 3. Scroll Reveal Sections
    gsap.utils.toArray('.story-card-v6').forEach((card: any) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // 4. Sticky CTA Reveal
    ScrollTrigger.create({
      trigger: '.product-info-reveal-v6',
      start: 'bottom 20%',
      onEnter: () => gsap.to('.sticky-cta-v6', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to('.sticky-cta-v6', { y: 100, opacity: 0, duration: 0.4, ease: 'power2.in' })
    });
  }

  private animationFrameId: number | null = null;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser || window.innerWidth < 992) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.zone.runOutsideAngular(() => {
        const x = (e.clientX - window.innerWidth / 2) / 40;
        const y = (e.clientY - window.innerHeight / 2) / 40;

        gsap.to('.product-frame-3d-v6', {
          rotateY: x,
          rotateX: -y,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        gsap.to('.hero-mesh-glow-v6', {
          x: x * 2,
          y: y * 2,
          duration: 2,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });
    });
  }

  changeQty(delta: number) {
    const next = this.selectedQty + delta;
    if (next >= 1) this.selectedQty = next;
  }

  triggerAddToCart() {
    if (this.product) {
      this.lastAddedQty = this.selectedQty;
      this.cartService.addToCart({
        id: this.product.id,
        name: this.product.title,
        price: this.product.price,
        image: this.product.image || '',
        quantity: this.selectedQty
      });

      this.isAdded = true;
      
      // Bounce animation for the main CTA button
      if (this.isBrowser) {
        gsap.fromTo('.btn-cta-v6:not(.sticky-cta-v6 .btn-cta-v6)', 
          { scale: 0.95 }, 
          { scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
        );
      }

      setTimeout(() => {
        this.isAdded = false;
      }, 2500);
    }
  }
}
