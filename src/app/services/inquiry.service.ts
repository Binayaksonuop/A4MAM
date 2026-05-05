import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private inquiriesSubject = new BehaviorSubject<AdminInquiry[]>([]);
  private storageKey = 'a4mam_admin_inquiries';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        // Parse dates back to Date objects
        const parsed = JSON.parse(stored).map((i: any) => ({ ...i, date: new Date(i.date) }));
        this.inquiriesSubject.next(parsed);
      } else {
        const initialData: AdminInquiry[] = [
          { id: 'INQ-101', name: 'NGO SaveChildren', email: 'contact@savechildren.org', message: 'Interested in bulk Chicky Bars for 500 kids.', status: 'New', date: new Date(), type: 'Bulk Order' },
          { id: 'INQ-102', name: 'Trishna Priyadarshini', email: 'trishna@a4conserv', message: 'How can I volunteer for the next screening?', status: 'Viewed', date: new Date(), type: 'Contact' }
        ];
        this.inquiriesSubject.next(initialData);
        this.saveToStorage(initialData);
      }
    }
  }

  private saveToStorage(inquiries: AdminInquiry[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(inquiries));
    }
  }

  getInquiries(): Observable<AdminInquiry[]> {
    return this.inquiriesSubject.asObservable();
  }

  updateInquiryStatus(id: string, status: AdminInquiry['status']): void {
    const inqs = this.inquiriesSubject.getValue().map(i => i.id === id ? { ...i, status } : i);
    this.inquiriesSubject.next(inqs);
    this.saveToStorage(inqs);
  }

  addInquiry(inquiryData: Omit<AdminInquiry, 'id' | 'status' | 'date'>): AdminInquiry {
    const newInquiry: AdminInquiry = {
      ...inquiryData,
      id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
      status: 'New',
      date: new Date()
    };
    
    const current = this.inquiriesSubject.getValue();
    const updated = [newInquiry, ...current];
    this.inquiriesSubject.next(updated);
    this.saveToStorage(updated);
    
    return newInquiry;
  }
}

