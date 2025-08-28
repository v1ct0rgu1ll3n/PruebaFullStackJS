import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const GuestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigate(['/dashboard']); // Redirige a dashboard si ya hay token
    return false;
  } else {
    return true; // Permite acceder
  }
};
