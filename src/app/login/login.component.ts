import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private authService: AuthService, public router: Router) { }
  Login() {
    this.authService.login(this.email, this.password)

  }
  ngOnInit() {
    if (!this.logauth()) {
      this.router.navigate(['login']);
    } else {
      const token = localStorage.getItem('auth_token');
      try {
        const tokenPayload = decode(token);
        if (tokenPayload.tipo == 'administrador') {
          this.router.navigate(['interfaz']);
        } else {
          this.router.navigate(['generar-ticket']);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  logauth(): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    } else {
      return true;
    }
  }


}
