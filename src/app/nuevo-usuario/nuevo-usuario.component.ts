import { Component, OnInit } from '@angular/core';
import { RegistroUsuarioService } from './../services/registro-usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  email = '';
  nombre = '';
  pass = '';
  passcon = '';

  constructor(public registro: RegistroUsuarioService, private router: Router) { }

  ngOnInit() {
  }

  Registrarse() {
    if (this.email == '' || this.nombre == '' || this.pass == '' || this.passcon == '') {
      Swal.fire("Aviso", "Llena todos los campos para registrarte", "info");
    } else {
      if (this.pass !== this.passcon) {
        Swal.fire("Aviso", "Las contraseñas no coinciden", "info");
      } else {
        this.registro.Registrar(this.email,this.nombre,this.pass);
      }
    }
  }

  Cancelar(){
    this.router.navigate(['login']);
  }

}
