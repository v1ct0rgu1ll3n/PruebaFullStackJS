import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Permite acceder
  } else {
    router.navigate(['/login']); // Redirige al login si no hay token
    return false;
  }
};
