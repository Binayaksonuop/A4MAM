import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('a4mam_admin_auth');
      if (session === 'true') {
        this.isLoggedInSubject.next(true);
      }
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(email: string, password: string): boolean {
    if (email === 'trishna@a4conserv' && password === 'admin123') {
      localStorage.setItem('a4mam_admin_auth', 'true');
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('a4mam_admin_auth');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/admin']);
  }
}
