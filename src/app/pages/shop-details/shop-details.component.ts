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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Title, Meta } from '@angular/platform-browser';

gsap.registerPlugin(ScrollTrigger);

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
  imports: [CommonModule, RouterModule],
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

  products: Record<string, ProductDetail> = {
    'child-kit': {
      id: 'child-kit',
      title: 'Child Nutrition Kit',
      subtitle: '30-Day Complete Recovery Plan',
      price: 1299,
      image: 'assets/images/Child Nutrition Kit.jpg',
      badge: 'Bestseller',
      description: 'A complete 30-day nutrition plan designed to support recovery from moderate and severe malnutrition in children. Powered by Spirulina — one of the most nutrient-dense foods on earth.',
      benefits: [
        'Supports healthy weight gain and growth in children.',
        'Provides Iron, Protein, and Vitamins essential for brain development.',
        'Easy daily pre-dosed packets — no preparation needed.'
      ],
      includes: [
        '30x Spirulina Chicky Bars (Protein + Iron)',
        '1x Caregiver Progress Tracker Diary',
        '1x Bio-fortified Multivitamin Drops'
      ],
      nutrition: { protein: 85, iron: 92, absorption: 95 }
    },
    'maternal-kit': {
      id: 'maternal-kit',
      title: 'Maternal Health Kit',
      subtitle: 'Pregnancy & Lactation Support',
      price: 1599,
      image: 'assets/images/Maternal Health Kit.jpg',
      badge: 'Essential',
      description: 'A targeted nutrition kit for pregnant and lactating mothers. Fights iron-deficiency anemia and supports healthy fetal development using organic Spirulina — naturally rich in Iron, Folate, and Protein.',
      benefits: [
        'Helps prevent iron-deficiency anemia during pregnancy.',
        'Supports healthy milk production for lactating mothers.',
        'Reduces the risk of low birth weight in newborns.'
      ],
      includes: [
        '60x Pure Spirulina Prenatal Capsules',
        '1x Maternal Diet Chart (Local Cuisine)',
        '1x Iron & Folic Acid Booster Pack'
      ],
      nutrition: { protein: 70, iron: 98, absorption: 90 }
    },
    'chicky-bars': {
      id: 'chicky-bars',
      title: 'Chicky Bars (Kids)',
      subtitle: 'Spirulina Nutrition Bar for Kids',
      price: 99,
      image: 'assets/images/chicky_bars_new.png',
      badge: 'Kids Favourite',
      description: 'A tasty, easy-to-eat Spirulina bar made for growing children. Packed with protein and Iron, the Chicky Bar is the perfect daily snack to support healthy growth — with no algae smell or taste.',
      benefits: [
        '12g protein per bar — supports daily growth needs.',
        'Great taste kids love — no algae smell or flavor.',
        'Quick energy for active, growing kids.'
      ],
      includes: [
        'Pack of 15 Chicky Bars'
      ],
      nutrition: { protein: 65, iron: 45, absorption: 95 }
    },
    'powder': {
      id: 'powder',
      title: 'Spirulina Powder',
      subtitle: '100% Pure Organic Spirulina',
      price: 799,
      image: 'assets/images/spirulina_2.png',
      badge: 'Pure',
      description: '100% natural, sun-dried Spirulina powder with no additives. The raw superfood in its most complete form — easy to mix into smoothies, dough, or everyday recipes for the whole family.',
      benefits: [
        '65% complete plant protein with all essential amino acids.',
        'Rich in Vitamin B12 and highly bioavailable Iron.',
        'No artificial additives, colors, or preservatives.'
      ],
      includes: [
        '250g Pure Spirulina Powder Jar',
        'Measuring Spoon'
      ],
      nutrition: { protein: 95, iron: 88, absorption: 92 }
    },
    'capsules': {
      id: 'capsules',
      title: 'Spirulina Capsules',
      subtitle: 'Daily Immunity & Energy Support',
      price: 649,
      image: 'assets/images/Spirulia Capsule.jpg',
      badge: 'Daily Use',
      description: 'FSSAI-certified Spirulina capsules for daily nutrition support. Ideal for adults looking to boost immunity, energy, and micronutrient intake — without changing their diet.',
      benefits: [
        'No preparation needed — one capsule a day.',
        'Precise daily dose of Iron, Protein, and B-Vitamins.',
        'Boosts immunity and reduces chronic fatigue.'
      ],
      includes: [
        '90x Spirulina Capsules (500mg each)',
        '1x Daily Dosage Reference Card'
      ],
      nutrition: { protein: 60, iron: 90, absorption: 95 }
    },
    'outreach-kit': {
      id: 'outreach-kit',
      title: 'Nutrition Outreach Kit',
      subtitle: 'Institutional Intervention Supply',
      price: 2500,
      image: 'assets/images/outreach_kit_s.png',
      badge: 'B2B / NGO',
      description: 'A comprehensive nutritional response kit designed for clinical outreach. Contains fortified Spirulina supplements, high-protein energy bars, and diagnostic tracking tools for field healthcare workers.',
      benefits: [
        'Designed for high-impact moderate acute malnutrition (MAM) recovery.',
        'Supports 50+ children per kit for initial intervention.',
        'Includes field-tested diagnostic MUAC tapes and tracking logs.'
      ],
      includes: [
        '100x Fortified Spirulina Sachet Units',
        '25x High-Density Chicky Bars',
        '10x Field Diagnostic Kits',
        'Institutional Logistics Support'
      ],
      nutrition: { protein: 90, iron: 95, absorption: 98 }
    }
  };

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
      
      console.log('ShopDetails: Looking for slug:', rawSlug, 'normalized:', normalizedSlug);
      
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
        
        console.log('ShopDetails: Found from API:', found);
        
        let localRichData = this.products[normalizedSlug] || this.products[rawSlug] || null;
        
        if (found) {
          localRichData = this.products[normalizedSlug] || this.products[found.slug || ''] || this.products['chicky-bars'];
          this.product = {
            id: found.id || found._id,
            title: found.name,
            subtitle: localRichData?.subtitle || 'Premium Nutritional Support',
            price: found.price,
            image: found.imageUrl,
            badge: localRichData?.badge || (found.status === 'Out of Stock' ? 'Sold Out' : 'Available'),
            description: found.description || localRichData?.description || 'A premium nutritional intervention product.',
            benefits: localRichData?.benefits || [
              'Provides essential micronutrients.',
              'Supports overall health and immunity.',
              'Highly bio-available formulation.'
            ],
            includes: localRichData?.includes || ['1x Premium Package'],
            nutrition: localRichData?.nutrition || { protein: 80, iron: 85, absorption: 90 }
          };
        } else if (localRichData) {
          console.log('ShopDetails: Using local data');
          this.product = localRichData;
        } else {
          // Last resort: check if slug matches any local product keys
          const matchingKey = Object.keys(this.products).find(key => 
            key === normalizedSlug || 
            key.includes(normalizedSlug) || 
            normalizedSlug.includes(key)
          );
          if (matchingKey) {
            console.log('ShopDetails: Last resort match:', matchingKey);
            this.product = this.products[matchingKey];
          } else {
            this.product = null;
          }
        }
        
        if (this.product) {
          this.titleService.setTitle(`${this.product.title} | A4MAM Shop`);
          this.metaService.updateTag({ name: 'description', content: this.product.description });
          this.metaService.updateTag({ property: 'og:title', content: this.product.title });
          this.metaService.updateTag({ property: 'og:description', content: this.product.description });
          this.metaService.updateTag({ property: 'og:image', content: this.product.image });

          if (this.isBrowser) {
            setTimeout(() => this.initHeroAnimation(), 50);
          }
        }
        
        this.isLoading = false;
      });
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initScrollAnimations();
      }, 150);
    });
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
