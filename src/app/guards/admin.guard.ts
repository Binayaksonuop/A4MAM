import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifyToken().pipe(
    take(1),
    map(isValid => {
      if (isValid) {
        return true;
      } else {
        router.navigate(['/admin']);
        return false;
      }
    })
  );
};
