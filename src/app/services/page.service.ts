import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CMSPage {
  _id: string;
  slug: string;
  title: string;
  hero?: {
    titleLine1: string;
    titleLine2?: string;
    titleLine3?: string;
    body?: string;
    image?: string;
    ctaButtons?: { label: string; link: string; style: string }[];
    statistics?: { label: string; value: string }[];
  };
  impactCounters?: {
    label: string;
    value: number;
    icon?: string;
    isAutoCalculated: boolean;
    calculationSource: string;
  }[];
  missionContent?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  ngoStatistics?: {
    label: string;
    value: string;
    description?: string;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    keywords?: string;
  };
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient) {}

  getPageBySlug(slug: string): Observable<ApiResponse<CMSPage>> {
    return this.http.get<ApiResponse<CMSPage>>(`${this.apiUrl}/${slug}`);
  }

  getAllPages(): Observable<ApiResponse<CMSPage[]>> {
    return this.http.get<ApiResponse<CMSPage[]>>(`${environment.apiUrl}/admin/pages`);
  }
}
