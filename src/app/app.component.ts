import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'soporte-app';
  aut = '';
  nombre = '';
  constructor(private auth: AuthService) { }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.aut = 'false';
    } else {
      const token = localStorage.getItem('auth_token');
      const tokenPayload = decode(token);

      this.nombre = tokenPayload.nombre;
      this.aut = 'true';
    }
  }

  Cerrar() {
    this.auth.logout();
  }

}
