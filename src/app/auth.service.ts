import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { sha256, sha224 } from 'js-sha256';
import { JwtHelperService } from '@auth0/angular-jwt';

/**
* @description Servicios para autentificacion de usuarios
*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri = 'http://localhost:5000/api';
  token;
  helper = new JwtHelperService();
  constructor(private http: HttpClient, private router: Router) { }
  login(email: string, password: string) {
    this.http.post(this.uri + '/authenticate', { email: email, password: sha256(password) })
      .subscribe((resp: any) => {
        localStorage.setItem('auth_token', resp.token);
        location.reload();
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403) {
            console.log("Contraseña o usuario incorrecto");
            Swal.fire("Error", "Usuario o contraseña incorrecto", "error");
          }
        }
      });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    //console.log(token);
    return (localStorage.getItem('auth_token') !== null);
    //console.log(this.helper.isTokenExpired(token));
  }

  logout() {
    localStorage.removeItem('auth_token');
    location.reload();
  }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

}
