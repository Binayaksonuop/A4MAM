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
  private storageKey = 'a4mam_admin_products';

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
            }
          }
          // General fix for other broken 's.png'
          else if (p.imageUrl === 'assets/images/s.png') {
            migrationNeeded = true;
            if (p.name.includes('Powder')) p.imageUrl = 'assets/images/spirulina_s.png';
            else if (p.name.includes('Capsule')) p.imageUrl = 'assets/images/Spirulia Capsule.jpg';
            else p.imageUrl = 'assets/images/spirulina_s.png';
          }
          return p;
        });

        if (migrationNeeded) {
          this.saveToStorage(products);
        }
        
        this.productsSubject.next(products);
      } else {
        const initialData: AdminProduct[] = [
          { id: '1', name: 'Premium Spirulina Powder', price: 999, stock: 45, status: 'In Stock', imageUrl: 'assets/images/spirulina_s.png', category: 'powder', slug: 'powder', description: '100% organic sun-dried powder.' },
          { id: '2', name: 'Spirulina Capsules', price: 1299, stock: 12, status: 'In Stock', imageUrl: 'assets/images/Spirulia Capsule.jpg', category: 'maternal', slug: 'capsules', description: 'Concentrated daily dosage.' },
          { id: '3', name: 'Nutrition Outreach Kit', price: 2500, stock: 50, status: 'In Stock', imageUrl: 'assets/images/outreach_kit_s.png', category: 'kit', slug: 'outreach-kit', description: 'Complete kit.' }
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
