import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCart();
  }

  private saveCart(items: CartItem[]) {
    if (this.isBrowser) {
      localStorage.setItem('a4mam_cart', JSON.stringify(items));
    }
    this.cartItems.next(items);
  }

  private loadCart() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('a4mam_cart');
      if (saved) {
        try {
          this.cartItems.next(JSON.parse(saved));
        } catch (e) {
          console.error('Could not parse cart', e);
        }
      }
    }
  }

  addToCart(item: CartItem) {
    const current = this.cartItems.value;
    const existing = current.find(i => i.id === item.id && i.option === item.option);

    if (existing) {
      existing.quantity += item.quantity;
      this.saveCart([...current]);
    } else {
      this.saveCart([...current, item]);
    }
  }

  removeFromCart(id: string, option?: string) {
    const current = this.cartItems.value;
    const filtered = current.filter(i => !(i.id === id && i.option === option));
    this.saveCart(filtered);
  }

  updateQuantity(id: string, quantity: number, option?: string) {
    const current = this.cartItems.value;
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
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }
}
