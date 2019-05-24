import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { sha256, sha224 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {

  uri = 'http://localhost:5000/api';
  constructor(private http: HttpClient, private router: Router) { }
  Registrar(email: string, nombre: string, pass: string) {
    this.http.post(this.uri + '/signup', { email: email, nombre: nombre, password: sha256(pass) })
      .subscribe((resp: any) => {
        Swal.fire("Registrado","El usuario se ha registrado correctamente","success");
        this.router.navigate(['login']);
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403) {
            Swal.fire("Error", "El correo ya se encuentra registrado", "error");
          }
        }
      });
  }


}
