import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
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
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentAdminSubject = new BehaviorSubject<Admin | null>(null);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.loadSession();
    }
  }

  private loadSession(): void {
    const token = localStorage.getItem('a4mam_admin_token');
    const adminData = localStorage.getItem('a4mam_admin_user');
    
    if (token && adminData) {
      this.isLoggedInSubject.next(true);
      this.currentAdminSubject.next(JSON.parse(adminData));
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getCurrentAdmin(): Observable<Admin | null> {
    return this.currentAdminSubject.asObservable();
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('a4mam_admin_token');
    }
    return null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          if (this.isBrowser) {
            localStorage.setItem('a4mam_admin_token', response.token);
            localStorage.setItem('a4mam_admin_user', JSON.stringify(response.admin));
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
      localStorage.removeItem('a4mam_admin_token');
      localStorage.removeItem('a4mam_admin_user');
    }
    this.isLoggedInSubject.next(false);
    this.currentAdminSubject.next(null);
    this.router.navigate(['/admin']);
  }
}
