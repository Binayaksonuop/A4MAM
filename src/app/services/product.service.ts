import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminProduct {
  id: string;
  _id?: string;
  name: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Out of Stock' | 'Draft' | 'Active';
  imageUrl: string;
  description?: string;
  category?: string;
  slug?: string;
}

interface BackendResponse {
  success: boolean;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private adminApiUrl = `${environment.apiUrl}/admin/products`;
  private publicApiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<AdminProduct[]>([]);

  constructor(private http: HttpClient) {}

  getProducts(isAdmin: boolean = false): Observable<AdminProduct[]> {
    const apiUrl = isAdmin ? this.adminApiUrl : this.publicApiUrl;
    console.log('ProductService: Fetching from:', apiUrl, '(admin:', isAdmin, ')');
    
    return this.http.get<BackendResponse>(apiUrl).pipe(
      map(response => {
        console.log('ProductService: Raw API response:', response);
        if (response.success) {
          const mapped = response.data.map(item => ({
            id: item._id,
            _id: item._id,
            name: item.name,
            price: item.price,
            stock: item.stock,
            status: (isAdmin || item.status === 'Active') ? item.status : (item.status === 'Active' ? 'In Stock' : item.status),
            imageUrl: item.imageUrl,
            description: item.description,
            category: item.category,
            slug: item.slug
          }));
          console.log('ProductService: Mapped products:', mapped);
          this.productsSubject.next(mapped);
          return mapped;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.adminApiUrl, product);
  }

  updateProduct(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}`, updates);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/${id}`);
  }
}
