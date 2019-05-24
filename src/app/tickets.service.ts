import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map } from "rxjs/operators";
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  uri = 'http://localhost:5000/api';


  constructor(private http: HttpClient) { }



  /**
  * @description Servicios de usuario administrador
  */

  listar() {
    const token = localStorage.getItem('auth_token');
    const tokenPayload = decode(token);
    return this.http.post(this.uri + '/listar', { categoria: tokenPayload.categoria });
  }

  observacion(id, texto) {
    return this.http.post(this.uri + '/agregarObservacion', { id: id, texto: texto });
  }

  realizado(id) {
    return this.http.post(this.uri + '/ticketRealizado', { id: id });
  }

  buscador(fechain, fechafi) {
    return this.http.post(this.uri + '/busqueda', { fechain: fechain, fechafi: fechafi });
  }

  /**
  * @description Servicios de usuario cliente
  */
  crearticket(tipo, descripcion) {
    const token = localStorage.getItem('auth_token');
    const tokenPayload = decode(token);
    return this.http.post(this.uri + '/crearticket', { tipo: tipo, descripcion: descripcion, id: tokenPayload.id, nombre: tokenPayload.nombre });
  }

  listarPendientes() {
    const token = localStorage.getItem('auth_token');
    const tokenPayload = decode(token);
    return this.http.post(this.uri + '/listarpendientes', { id: tokenPayload.id });
  }

  agregarDescripcion(id, descripcion) {
    return this.http.post(this.uri + '/editarDescripcion', { id: id, descripcion: descripcion });
  }

  /**
  * @description Servicio para de archivos
  */

  almacenarArchivos(id, name) {
    return this.http.post(this.uri + '/almacenarRutas', { id: id, name: name });
  }

  obtenerArchivos(id) {
    return this.http.post(this.uri + '/obtenerRutas', { id: id });
  }

}
