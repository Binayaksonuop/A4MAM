import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Auth Interceptor: Request URL:', req.url);
  console.log('Auth Interceptor: Token present:', !!token);

  // If we have a token and the request is to our API, clone and add authorization header
  // We only add it if the request is to /api/admin
  if (token && req.url.includes('/api/admin')) {
    console.log('Auth Interceptor: Adding Authorization header');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
