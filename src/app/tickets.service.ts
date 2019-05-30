import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map } from "rxjs/operators";
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  uri = 'http://ns3.hellogoogle.mx:5000/api';
  //uri = 'http://192.168.1.199:5000/api';

  constructor(private http: HttpClient) { }

  /**
  * @description Servicios para usuario administrador autorizaciones
  */

  listarAutorizaciones() {
    return this.http.get(this.uri + '/listarAutorizaciones');
  }

  Aprobar(id) {
    return this.http.post(this.uri + '/Aprobar', { id: id });
  }

  Rechazar(id, descripcion) {
    return this.http.post(this.uri + '/Rechazar', { id: id, descripcion: descripcion });
  }
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

  listarClientes() {
    return this.http.get(this.uri + '/listarClientes');
  }

  buscador(fechain, fechafi) {
    return this.http.post(this.uri + '/busqueda', { fechain: fechain, fechafi: fechafi });
  }
  buscadorCliente(fechain, fechafi, cliente) {
    return this.http.post(this.uri + '/busquedaCliente', { fechain: fechain, fechafi: fechafi, cliente: cliente });
  }
  enviarAutorizacion(id) {
    return this.http.post(this.uri + '/enviarAutorizacion', { id: id });
  }

  /**
  * @description Servicios de usuario cliente
  */
  crearticket(tipo, autorizacion, descripcion) {
    const token = localStorage.getItem('auth_token');
    const tokenPayload = decode(token);
    return this.http.post(this.uri + '/crearticket', { tipo: tipo, autorizacion: autorizacion, descripcion: descripcion, id: tokenPayload.id, nombre: tokenPayload.nombre, correo: tokenPayload.email });
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
  * @description Servicio para archivos
  */

  almacenarArchivos(id, name) {
    return this.http.post(this.uri + '/almacenarRutas', { id: id, name: name });
  }

  obtenerArchivos(id) {
    return this.http.post(this.uri + '/obtenerRutas', { id: id });
  }

}
