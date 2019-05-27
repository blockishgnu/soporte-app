import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './../auth.service';
import decode from 'jwt-decode';


/**
* @description Proteger rutas con parametros de usuario
*/
@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('auth_token');

    try {
      const tokenPayload = decode(token);
      if (!this.auth.isAuthenticated() || tokenPayload.tipo !== expectedRole) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    } catch (error) {
      this.router.navigate(['login']);
      return false;
    }
  }
}
