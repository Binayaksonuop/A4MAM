import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminOrder {
  id: string;
  mongoId: string; // Store real DB ID for updates
  type: 'Product' | 'Donation';
  amount: number;
  paymentMethod: 'upi' | 'cod';
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: Date;
  customerName: string;
}

interface BackendResponse {
  success: boolean;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/admin/orders`;
  private publicUrl = `${environment.apiUrl}/orders`;
  private ordersSubject = new BehaviorSubject<AdminOrder[]>([]);

  constructor(private http: HttpClient) {}

  getOrders(): Observable<AdminOrder[]> {
    return this.http.get<BackendResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          const mapped: AdminOrder[] = response.data.map(item => ({
            id: item.orderId,
            mongoId: item._id,
            type: 'Product', // Assuming Product orders for now
            amount: item.totalAmount,
            paymentMethod: item.paymentMethod,
            status: item.orderStatus,
            date: new Date(item.createdAt),
            customerName: item.customerName
          }));
          this.ordersSubject.next(mapped);
          return mapped;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);
      })
    );
  }
 
  updateOrderStatus(id: string, status: AdminOrder['status']): void {
    // Find mongoId from readable orderId
    const order = this.ordersSubject.getValue().find(o => o.id === id);
    if (!order) return;
 
    this.http.patch(`${this.apiUrl}/${order.mongoId}/status`, { orderStatus: status }).subscribe({
      next: () => {
        const current = this.ordersSubject.getValue();
        const updated = current.map(o => o.id === id ? { ...o, status } : o);
        this.ordersSubject.next(updated);
      },
      error: (err) => console.error('Error updating order status:', err)
    });
  }

  deleteOrder(mongoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${mongoId}`).pipe(
      tap(() => {
        const current = this.ordersSubject.getValue();
        this.ordersSubject.next(current.filter(o => o.mongoId !== mongoId));
      }),
      catchError(error => {
        console.error('Error deleting order:', error);
        return of(null);
      })
    );
  }

  // Public method to place order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(this.publicUrl, orderData);
  }
}
