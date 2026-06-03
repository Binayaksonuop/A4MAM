import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResearchArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  author: string;
  publishedDate: Date;
  status: 'Draft' | 'Published';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  private apiUrl = `${environment.apiUrl}/research`;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<ApiResponse<ResearchArticle[]>> {
    return this.http.get<ApiResponse<ResearchArticle[]>>(this.apiUrl);
  }

  getArticleBySlug(slug: string): Observable<ApiResponse<ResearchArticle>> {
    return this.http.get<ApiResponse<ResearchArticle>>(`${this.apiUrl}/${slug}`);
  }

  getAdminArticles(): Observable<ApiResponse<ResearchArticle[]>> {
    return this.http.get<ApiResponse<ResearchArticle[]>>(`${environment.apiUrl}/admin/research`);
  }

  addArticle(article: Partial<ResearchArticle>): Observable<ApiResponse<ResearchArticle>> {
    return this.http.post<ApiResponse<ResearchArticle>>(`${environment.apiUrl}/admin/research`, article);
  }

  updateArticle(id: string, updates: Partial<ResearchArticle>): Observable<ApiResponse<ResearchArticle>> {
    return this.http.put<ApiResponse<ResearchArticle>>(`${environment.apiUrl}/admin/research/${id}`, updates);
  }

  deleteArticle(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/research/${id}`);
  }
}

