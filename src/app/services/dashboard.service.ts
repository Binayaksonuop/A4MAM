import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminStats {
  childrenScreened: number;
  kitsDistributed: number;
  activeInterventions: number;
  recoveryRate: number;
  totalDonations: number;
  pendingCOD: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private statsSubject = new BehaviorSubject<AdminStats>({
    childrenScreened: 1542,
    kitsDistributed: 840,
    activeInterventions: 320,
    recoveryRate: 92.5,
    totalDonations: 452000,
    pendingCOD: 12450
  });
  private storageKey = 'a4mam_admin_stats';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.statsSubject.next(JSON.parse(stored));
      } else {
        this.saveToStorage(this.statsSubject.value);
      }
    }
  }

  private saveToStorage(stats: AdminStats): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }
  }

  getStats(): Observable<AdminStats> {
    return this.statsSubject.asObservable();
  }

  updateStats(newStats: Partial<AdminStats>): void {
    const current = this.statsSubject.getValue();
    const updated = { ...current, ...newStats };
    this.statsSubject.next(updated);
    this.saveToStorage(updated);
  }
}
