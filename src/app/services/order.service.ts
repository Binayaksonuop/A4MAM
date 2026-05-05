import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminOrder {
  id: string;
  type: 'Product' | 'Donation';
  amount: number;
  paymentMethod: 'UPI' | 'COD';
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: Date;
  customerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<AdminOrder[]>([
    { id: 'ORD-8821', type: 'Product', amount: 1299, paymentMethod: 'UPI', status: 'Delivered', date: new Date(), customerName: 'Rajesh Kumar' },
    { id: 'DON-9902', type: 'Donation', amount: 5000, paymentMethod: 'UPI', status: 'Delivered', date: new Date(), customerName: 'Suman Singh' },
    { id: 'ORD-8825', type: 'Product', amount: 499, paymentMethod: 'COD', status: 'Pending', date: new Date(), customerName: 'Amit Patel' }
  ]);

  constructor() { }

  getOrders(): Observable<AdminOrder[]> {
    return this.ordersSubject.asObservable();
  }

  updateOrderStatus(id: string, status: AdminOrder['status']): void {
    const orders = this.ordersSubject.getValue().map(o => o.id === id ? { ...o, status } : o);
    this.ordersSubject.next(orders);
  }
}
