import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Out of Stock' | 'Draft';
  imageUrl: string;
  description?: string;
  category?: string;
  slug?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<AdminProduct[]>([]);
  private storageKey = 'a4mam_admin_products_v2';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        let products: AdminProduct[] = JSON.parse(stored);
        
        // Migration: Fix broken 's.png' images from previous versions
        let migrationNeeded = false;
        products = products.map(p => {
          // Force update for Outreach Kit to ensure the new premium image is used
          if (p.name.includes('Outreach Kit') || p.slug === 'outreach-kit') {
            if (p.imageUrl !== 'assets/images/outreach_kit_s.png' || p.status === 'Out of Stock') {
              migrationNeeded = true;
              p.imageUrl = 'assets/images/outreach_kit_s.png';
              p.status = 'In Stock';
              p.stock = 50;
              p.slug = 'outreach-kit';
            }
          }
          // General fix for other broken 's.png'
          else if (p.imageUrl === 'assets/images/s.png') {
            migrationNeeded = true;
            if (p.name.includes('Powder')) p.imageUrl = 'assets/images/spirulina_s.png';
            else if (p.name.includes('Capsule')) p.imageUrl = 'assets/images/Spirulia Capsule.jpg';
            else p.imageUrl = 'assets/images/spirulina_s.png';
          }

          // Ensure slugs are hyphenated and clean
          if (p.slug && p.slug.includes(' ')) {
            migrationNeeded = true;
            p.slug = p.slug.trim().toLowerCase().replace(/\s+/g, '-');
          } else if (!p.slug) {
            migrationNeeded = true;
            p.slug = p.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          }

          return p;
        });

        if (migrationNeeded) {
          this.saveToStorage(products);
        }
        
        this.productsSubject.next(products);
      } else {
        const initialData: AdminProduct[] = [
          { id: '1', name: 'Premium Spirulina Powder', price: 999, stock: 45, status: 'In Stock', imageUrl: 'assets/images/spirulina_2.png', category: 'powder', slug: 'powder', description: '100% organic sun-dried powder. The raw superfood in its most complete form.' },
          { id: '2', name: 'Spirulina Capsules', price: 649, stock: 12, status: 'In Stock', imageUrl: 'assets/images/Spirulia Capsule.jpg', category: 'maternal', slug: 'capsules', description: 'Daily Immunity & Energy Support. FSSAI-certified Spirulina capsules.' },
          { id: '3', name: 'Nutrition Outreach Kit', price: 2500, stock: 50, status: 'In Stock', imageUrl: 'assets/images/outreach_kit_s.png', category: 'kit', slug: 'outreach-kit', description: 'Institutional Intervention Supply. Designed for high-impact MAM recovery.' },
          { id: '4', name: 'Chicky Bars (Kids)', price: 499, stock: 100, status: 'In Stock', imageUrl: 'assets/images/chicky_bars_new.png', category: 'kids', slug: 'chicky-bars', description: 'Spirulina Nutrition Bar for Kids. Packed with protein and Iron.' },
          { id: '5', name: 'Child Nutrition Kit', price: 1299, stock: 30, status: 'In Stock', imageUrl: 'assets/images/Child Nutrition Kit.jpg', category: 'kit', slug: 'child-kit', description: '30-Day Complete Recovery Plan for children.' },
          { id: '6', name: 'Maternal Health Kit', price: 1599, stock: 25, status: 'In Stock', imageUrl: 'assets/images/Maternal Health Kit.jpg', category: 'maternal', slug: 'maternal-kit', description: 'Pregnancy & Lactation Support. Fights iron-deficiency anemia.' }
        ];
        this.productsSubject.next(initialData);
        this.saveToStorage(initialData);
      }
    }
  }

  private saveToStorage(products: AdminProduct[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(products));
    }
  }

  getProducts(): Observable<AdminProduct[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Omit<AdminProduct, 'id'>): void {
    const newProduct = { ...product, id: Date.now().toString() };
    const current = this.productsSubject.value;
    const updated = [...current, newProduct];
    this.productsSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateProduct(id: string, updates: Partial<AdminProduct>): void {
    const current = this.productsSubject.value;
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    this.productsSubject.next(updated);
    this.saveToStorage(updated);
  }

  deleteProduct(id: string): void {
    const current = this.productsSubject.value;
    const updated = current.filter(p => p.id !== id);
    this.productsSubject.next(updated);
    this.saveToStorage(updated);
  }
}
