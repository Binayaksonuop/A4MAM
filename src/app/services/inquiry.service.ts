import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
  status: 'New' | 'Viewed' | 'Responded';
  date: Date;
  type: 'Contact' | 'Bulk Order' | 'Partnership';
}

interface BackendResponse {
  success: boolean;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private apiUrl = `${environment.apiUrl}/admin/inquiries`;
  private publicUrl = `${environment.apiUrl}/inquiries`;
  private inquiriesSubject = new BehaviorSubject<AdminInquiry[]>([]);

  constructor(private http: HttpClient) {}

  getInquiries(): Observable<AdminInquiry[]> {
    return this.http.get<BackendResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          const mapped = response.data.map(item => ({
            id: item._id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            organization: item.organization,
            message: item.message,
            status: item.status,
            date: new Date(item.createdAt),
            type: item.type
          }));
          this.inquiriesSubject.next(mapped);
          return mapped;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching inquiries:', error);
        return of([]);
      })
    );
  }

  updateInquiryStatus(id: string, status: AdminInquiry['status']): void {
    this.http.patch(`${this.apiUrl}/${id}/status`, { status }).subscribe({
      next: () => {
        const current = this.inquiriesSubject.getValue();
        const updated = current.map(i => i.id === id ? { ...i, status } : i);
        this.inquiriesSubject.next(updated);
      },
      error: (err) => console.error('Error updating inquiry status:', err)
    });
  }

  // Public method to submit inquiry
  addInquiry(inquiryData: any): Observable<any> {
    return this.http.post(this.publicUrl, inquiryData);
  }
}
