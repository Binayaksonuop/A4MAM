import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  private currentAdminSubject: BehaviorSubject<Admin | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    let initialIsLoggedIn = false;
    let initialAdmin: Admin | null = null;
    
    if (this.isBrowser) {
      // Security Improvement: Migrated from localStorage to sessionStorage
      // Note: For true XSS protection, the backend should issue HttpOnly cookies.
      const token = sessionStorage.getItem('a4mam_admin_token');
      const adminData = sessionStorage.getItem('a4mam_admin_user');
      if (token && adminData) {
        initialIsLoggedIn = true;
        initialAdmin = JSON.parse(adminData);
      }
    }
    
    this.isLoggedInSubject = new BehaviorSubject<boolean>(initialIsLoggedIn);
    this.currentAdminSubject = new BehaviorSubject<Admin | null>(initialAdmin);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getCurrentAdmin(): Observable<Admin | null> {
    return this.currentAdminSubject.asObservable();
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('a4mam_admin_token');
    }
    return null;
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return of(false);
    }
    
    // Call backend to verify token cryptographically
    return this.http.get<{success: boolean}>(`${this.apiUrl}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.success),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          if (this.isBrowser) {
            sessionStorage.setItem('a4mam_admin_token', response.token);
            sessionStorage.setItem('a4mam_admin_user', JSON.stringify(response.admin));
          }
          this.isLoggedInSubject.next(true);
          this.currentAdminSubject.next(response.admin);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('a4mam_admin_token');
      sessionStorage.removeItem('a4mam_admin_user');
    }
    this.isLoggedInSubject.next(false);
    this.currentAdminSubject.next(null);
    this.router.navigate(['/admin']);
  }
}
