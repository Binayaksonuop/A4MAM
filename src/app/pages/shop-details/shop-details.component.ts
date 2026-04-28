import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
}

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit {
  productId: string = '';
  product: ProductDetail | null = null;
  isAdded: boolean = false;
  selectedQty: number = 1;
  lastAddedQty: number = 1;

  products: Record<string, ProductDetail> = {
    'child-kit': {
      id: 'child-kit',
      title: 'Child Nutrition Kit',
      subtitle: '30-Day Complete Recovery Plan',
      price: 1299,
      image: '/assets/images/Child Nutrition Kit.jpg',
      badge: 'Bestseller',
      description: 'A scientifically formulated 30-day recovery protocol designed specifically to combat severe and moderate acute malnutrition in children. Powered by high-bioavailability Spirulina.',
      benefits: [
        'Accelerates weight-for-height recovery in kids.',
        'Prevents cognitive stunting through essential micronutrients.',
        'Easy to consume with daily pre-dosed packets.'
      ],
      includes: [
        '30x Spirulina Chicky Bars (Protein + Iron)',
        '1x Caregiver Progress Tracker Diary',
        '1x Bio-fortified multivitamin drops'
      ]
    },
    'maternal-kit': {
      id: 'maternal-kit',
      title: 'Maternal Health Kit',
      subtitle: 'Pregnancy & Lactation Care',
      price: 1599,
      image: '/assets/images/Maternal Health Kit.jpg',
      badge: 'Essential',
      description: 'An intensive nutritional intervention designed for pregnant and lactating mothers. Fights maternal anemia and ensures robust fetal development with purely organic Spirulina derivatives.',
      benefits: [
        'Naturally prevents iron-deficiency anemia.',
        'Improves lactation quality and quantity.',
        'Reduces risks of low birth weight.'
      ],
      includes: [
        '60x Pure Spirulina Prenatal Capsules',
        '1x Maternal Diet Chart (Local Cuisine)',
        '1x Iron & Folic Acid Booster Pack'
      ]
    },
    'chicky-bars': {
      id: 'chicky-bars',
      title: 'Chicky Bars (Kids)',
      subtitle: 'Protein Snack',
      price: 499,
      image: '/assets/images/chicky_bars_new.png',
      badge: 'Snack',
      description: 'Delicious, easy-to-digest protein bars infused with Spirulina. The perfect mid-day snack to boost daily hemoglobin and protein intake for growing children.',
      benefits: [
        'High protein content per bar.',
        'Kid-friendly taste overriding the algae flavor.',
        'Instant energy boost.'
      ],
      includes: [
        'Pack of 15 Chicky Bars'
      ]
    },
    'powder': {
      id: 'powder',
      title: 'Spirulina Powder',
      subtitle: 'Pure Organic',
      price: 799,
      image: '/assets/images/spirulina_2.png',
      badge: 'Pure',
      description: '100% natural, sun-dried Spirulina powder. The raw superfood with maximum bioavailability, perfect for mixing into smoothies, dough, or local recipes.',
      benefits: [
        '65% complete plant protein.',
        'Rich in Vitamin B12 and Iron.',
        'No artificial additives.'
      ],
      includes: [
        '250g Pure Spirulina Powder Jar',
        'Measuring Spoon'
      ]
    },
    'capsules': {
      id: 'capsules',
      title: 'Spirulina Capsules',
      subtitle: 'Daily Supplement',
      price: 649,
      image: '/assets/images/Spirulia Capsule.jpg',
      badge: 'Daily Use',
      description: 'Pharmaceutical-grade Spirulina encapsulated for maximum convenience. Ideal for adults seeking daily immune support, energy boost, and micronutrient replenishment without altering diet.',
      benefits: [
        'Zero preparation required — just swallow.',
        'Precise daily dosage in each capsule.',
        'Boosts immunity and reduces fatigue.'
      ],
      includes: [
        '90x Spirulina Capsules (500mg each)',
        '1x Daily Dosage Reference Card'
      ]
    },
    'bulk': {
      id: 'bulk',
      title: 'NGO & Institutional Supply',
      subtitle: 'Wholesale CSR Distribution',
      price: 19999,
      image: '', // Glowing icon fallback ideal for B2B
      badge: 'Institutional',
      description: 'Partner with A4MAM to eradicate malnutrition at scale. We offer heavily subsidized wholesale rates for NGOs, schools, and corporate CSR initiatives looking to deploy Spirulina in high-need tribal or urban areas.',
      benefits: [
        'Massive economies of scale with subsidized wholesale pricing.',
        'Direct logistical support and customized packaging for camps.',
        'Comprehensive clinical tracking guides included.'
      ],
      includes: [
        'Complete Bulk Supply (Equivalent to 100+ Kits/Boxes)',
        'Official A4MAM Partnership Certificate',
        'On-ground Training & Distribution Guides'
      ]
    }
  };

  constructor(private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      if (segments.length > 0) {
        // e.g. path 'shop/child-kit' means segments[0].path = 'child-kit' 
        // if router is configured to map to :id
        const segmentPath = segments[segments.length - 1].path;
        this.productId = segmentPath;
        this.product = this.products[this.productId] || null;
      }
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
      
      // Beautiful visual feedback
      this.isAdded = true;
      setTimeout(() => {
        this.isAdded = false;
      }, 2500);
    }
  }
}
