import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  location?: string;
  quote: string;
  rating: number;
  avatar?: string;
  acceptanceRate?: string;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private apiUrl = `${environment.apiUrl}/testimonials`;

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<ApiResponse<Testimonial[]>> {
    return this.http.get<ApiResponse<Testimonial[]>>(this.apiUrl);
  }

  createTestimonial(data: Partial<Testimonial>): Observable<ApiResponse<Testimonial>> {
    return this.http.post<ApiResponse<Testimonial>>(`${environment.apiUrl}/admin/testimonials`, data);
  }

  deleteTestimonial(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/testimonials/${id}`);
  }
}
