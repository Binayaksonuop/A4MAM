import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  option?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Use Angular Signals for state management
  private cartItemsSignal = signal<CartItem[]>([]);
  public cartItems = this.cartItemsSignal.asReadonly();

  // Computed signals
  public cartTotal = computed(() => 
    this.cartItemsSignal().reduce((total, item) => total + (item.price * item.quantity), 0)
  );

  public cartCount = computed(() => 
    this.cartItemsSignal().reduce((count, item) => count + item.quantity, 0)
  );

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCart();
  }

  private saveCart(items: CartItem[]) {
    if (this.isBrowser) {
      localStorage.setItem('a4mam_cart', JSON.stringify(items));
    }
    this.cartItemsSignal.set(items);
  }

  private loadCart() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('a4mam_cart');
      if (saved) {
        try {
          this.cartItemsSignal.set(JSON.parse(saved));
        } catch (e) {
          console.error('Could not parse cart', e);
        }
      }
    }
  }

  addToCart(item: CartItem) {
    const current = this.cartItemsSignal();
    const existing = current.find(i => i.id === item.id && i.option === item.option);

    if (existing) {
      existing.quantity += item.quantity;
      this.saveCart([...current]);
    } else {
      this.saveCart([...current, item]);
    }
  }

  removeFromCart(id: string, option?: string) {
    const current = this.cartItemsSignal();
    const filtered = current.filter(i => !(i.id === id && i.option === option));
    this.saveCart(filtered);
  }

  updateQuantity(id: string, quantity: number, option?: string) {
    const current = this.cartItemsSignal();
    const item = current.find(i => i.id === id && i.option === option);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(id, option);
      } else {
        this.saveCart([...current]);
      }
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartTotal() {
    return this.cartTotal();
  }

  getCartCount() {
    return this.cartCount();
  }
}
