import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = `${environment.apiUrl}/faqs`;

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<ApiResponse<FAQ[]>> {
    return this.http.get<ApiResponse<FAQ[]>>(this.apiUrl);
  }

  createFaq(data: Partial<FAQ>): Observable<ApiResponse<FAQ>> {
    return this.http.post<ApiResponse<FAQ>>(`${environment.apiUrl}/admin/faqs`, data);
  }

  updateFaq(id: string, data: Partial<FAQ>): Observable<ApiResponse<FAQ>> {
    return this.http.put<ApiResponse<FAQ>>(`${environment.apiUrl}/admin/faqs/${id}`, data);
  }

  deleteFaq(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/faqs/${id}`);
  }
}
