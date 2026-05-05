import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DonationPlan {
  id: string;
  name: string;
  amount: number;
  impactText: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private plansSubject = new BehaviorSubject<DonationPlan[]>([]);
  private storageKey = 'a4mam_donation_plans';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.plansSubject.next(JSON.parse(stored));
      } else {
        const initialData: DonationPlan[] = [
          { id: '1', name: 'Seed Plan', amount: 500, impactText: 'Provides basic nutrition kit for 1 child.', active: true },
          { id: '2', name: 'Growth Plan', amount: 1500, impactText: 'Supports a child for 3 months with monitoring.', active: true },
          { id: '3', name: 'Recovery Plan', amount: 5000, impactText: 'Full clinical intervention and family support for 6 months.', active: true },
          { id: '4', name: 'Custom Amount', amount: 0, impactText: 'Contribute any amount to the general mission fund.', active: true }
        ];
        this.plansSubject.next(initialData);
        this.saveToStorage(initialData);
      }
    }
  }

  private saveToStorage(plans: DonationPlan[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(plans));
    }
  }

  getPlans(): Observable<DonationPlan[]> {
    return this.plansSubject.asObservable();
  }

  updatePlan(id: string, updates: Partial<DonationPlan>): void {
    const current = this.plansSubject.value;
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    this.plansSubject.next(updated);
    this.saveToStorage(updated);
  }
}
