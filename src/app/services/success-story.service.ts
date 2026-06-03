import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  _id?: string;
}

export interface SuccessStory {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  images?: string[];
  status?: string;
  featuredImage?: string;
  date: string;
  impactMetrics?: ImpactMetric[];
  seo?: SEO;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SuccessStoryService {
  private apiUrl = `${environment.apiUrl}/success-stories`;

  constructor(private http: HttpClient) {}

  getStories(): Observable<ApiResponse<SuccessStory[]>> {
    return this.http.get<ApiResponse<SuccessStory[]>>(this.apiUrl);
  }

  getStoryBySlug(slug: string): Observable<ApiResponse<SuccessStory>> {
    return this.http.get<ApiResponse<SuccessStory>>(`${this.apiUrl}/${slug}`);
  }

  createStory(data: Partial<SuccessStory>): Observable<ApiResponse<SuccessStory>> {
    return this.http.post<ApiResponse<SuccessStory>>(`${environment.apiUrl}/admin/success-stories`, data);
  }

  deleteStory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/success-stories/${id}`);
  }
}
