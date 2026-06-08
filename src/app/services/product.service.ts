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

  fallbackProducts: AdminProduct[] = [
    {
      id: '1',
      _id: '1',
      name: 'Chicky Bars',
      slug: 'chicky-bars',
      description: 'A nutritious and delicious snack packed with the power of Spirulina.',
      price: 99,
      stock: 500,
      status: 'In Stock',
      imageUrl: 'assets/images/chicky_s.png',
      category: 'kids'
    },
    {
      id: '2',
      _id: '2',
      name: 'Spirulina Capsules',
      slug: 'capsules',
      description: '100% Pure Pharmaceutical grade Spirulina in easy-to-consume capsules.',
      price: 649,
      stock: 100,
      status: 'In Stock',
      imageUrl: 'assets/images/Spirulia Capsule.jpg',
      category: 'maternal'
    },
    {
      id: '3',
      _id: '3',
      name: 'Child Nutrition Kit',
      slug: 'child-kit',
      description: 'A comprehensive 30-day nutrition kit for moderate acute malnutrition recovery.',
      price: 1299,
      stock: 50,
      status: 'In Stock',
      imageUrl: 'assets/images/Child Nutrition Kit.jpg',
      category: 'kit'
    },
    {
      id: '4',
      _id: '4',
      name: 'Maternal Health Kit',
      slug: 'maternal-kit',
      description: 'A targeted nutrition kit for pregnant and lactating mothers.',
      price: 1599,
      stock: 30,
      status: 'In Stock',
      imageUrl: 'assets/images/Maternal Health Kit.jpg',
      category: 'kit'
    },
    {
      id: '5',
      _id: '5',
      name: 'Pure Spirulina Powder',
      slug: 'powder',
      description: '100% Pure Organic Spirulina Powder.',
      price: 799,
      stock: 200,
      status: 'In Stock',
      imageUrl: 'assets/images/spirulina_s.png',
      category: 'powder'
    }
  ];

  constructor(private http: HttpClient) {}

  getProducts(isAdmin: boolean = false): Observable<AdminProduct[]> {
    const apiUrl = isAdmin ? this.adminApiUrl : this.publicApiUrl;
    
    return this.http.get<BackendResponse>(apiUrl).pipe(
      map(response => {
        if (response.success && response.data && response.data.length > 0) {
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
          this.productsSubject.next(mapped);
          return mapped;
        }
        return this.fallbackProducts;
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of(this.fallbackProducts);
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
