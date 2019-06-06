import { Component, OnInit } from '@angular/core';
import { TicketsService } from "../tickets.service";
import "rxjs/add/operator/map";
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-interfaz',
  templateUrl: './interfaz.component.html',
  styleUrls: ['./interfaz.component.css']
})

/*
export interface DataTickets {
  id: number;
  tipo: string;
  descripcion: string;
  usuario: string;
  mail: string;
  id_usuario: number;
  estatus: string;
  observacion: string;
  req_autorizacion:string;
  aprobado:string;
  observacion_rechazo:string;
  fecha:string;

}
*/

export class InterfazComponent implements OnInit {

  tickets = [];
  clientes = [];
  res = '';
  busqueda = [];
  fechafi = '';
  fechain = '';
  rutasArchivos = [];
  clienteselected = '';
  cantidad = 0;
  historial = [];

  constructor(private tic: TicketsService, private auth: AuthService) { }

  ngOnInit() {
    this.tic.listar()
      .subscribe((data) => {
        this.tickets = data['rows'];
      });

    this.tic.listarClientes()
      .subscribe((data) => {
        this.clientes = data['rows'];
      });
  }

  detalles(id, usuario, descripcion, fecha, observacion) {
    var archivos = '';
    var historial = '';
    this.tic.obtenerArchivos(id)
      .subscribe((data: any) => {

        if (data.Message == 'Not-found') {
          archivos = 'Sin archivos adjuntos';
        } else {
          this.rutasArchivos = data.rows;
          for (var i = 0; this.rutasArchivos.length > i; i++) {
            archivos = archivos + '<a href="http://soporte.hellodigital.com.mx/backend/archivos/' +
              this.rutasArchivos[i].ruta + '" target="_blank"><i class="far fa-file-alt fa-lg"></i></a> ';
          }
        }
        this.tic.obtenerHistorial(id)
          .subscribe((data: any) => {
            if (data.Message == 'Not-found') {
              historial = '<tr>Sin historial para mostrar</tr>';
            } else {
              historial = '<table class="table" style="font-size:12px;">' +
                '<thead><tr><th>Estatus</th><th>Comentario</th><th>Fecha</th><th>Hora</th>' +
                '</thead>' +
                '<tbody>';
              this.historial = data.rows;
              for (var i = 0; this.historial.length > i; i++) {
                let date = new Date(this.historial[i].fecha);
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                historial = historial + '<tr>' + '<td>' + this.historial[i].estatus + '</td>' +
                  '<td>' + this.historial[i].comentario + '</td>' + '<td>' + day + '-' + month + '-' + year + '</td>' +
                  '<td>' + this.historial[i].hora + '</td>' + '</tr> ';
              }
              historial = historial +
                '</tbody>' +
                '</table>';

            }

            Swal.fire({
              title: '<strong>Historial</strong>',
              html:
                historial +
                '<h5><b>Descripcion del ticket:</b></h5>' +
                descripcion +
                '<h5>Observaciones</h5>' +
                '<textarea id="textOb" class="form-control" style="border: 1px solid #aaa;">' + observacion +
                '</textarea> <br>' +
                '<button id="observacion" class="btn btn-success"><i class="fas fa-paper-plane"></i> Enviar</button>' +
                ' <button id="autorizacion" class="btn btn-warning"><i class="fas fa-user-lock"></i> Autorización</button>' +
                '<hr style="border: 1px solid #aaa;">' +
                '<h5>Archivos adjuntos</h5>' +
                archivos +
                '<hr style="border: 1px solid #aaa;">',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText:
                '<i class="fas fa-clipboard-check"></i> Resuelto',
              confirmButtonAriaLabel: 'Thumbs up, great!',
              cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>',
              cancelButtonAriaLabel: 'Thumbs down',
              onBeforeOpen: () => {
                const content = Swal.getContent()
                const $ = content.querySelector.bind(content)
                const observacion = $('#observacion');
                const texto = $("#textOb");
                const autorizacion = $('#autorizacion');

                observacion.addEventListener('click', () => {
                  this.CrearObservacion(id, texto.value);
                });
                autorizacion.addEventListener('click', () => {
                  this.enviarAutorizacion(id);
                });
              },
            }).then((result) => {
              if (result.value) {
                this.ticketRealizado(id);
              }
            });
          });
      });
  }

  CrearObservacion(id, texto) {
    if (texto == '') {
      Swal.fire('Campos vacios', 'Debes escribir una observacion', 'warning');
    } else {
      this.tic.observacion(id, texto)
        .subscribe((data: any) => {
          Swal.fire('Correcto',
            'Se actualizo la observacion correctamente',
            'success').then((result) => {
              if (result.value) {
                location.reload();
              }
            });
          location.reload();
        }, (err: any) => {
          Swal.fire('Fallo', 'Ocurrio un error al actualizar la observacion', 'error');
        });
    }
  }

  enviarAutorizacion(id) {
    this.tic.enviarAutorizacion(id)
      .subscribe((data: any) => {
        Swal.fire('Correcto',
          'Se envio la peticion de autorizacion correctamente',
          'success').then((result) => {
            if (result.value) {
              location.reload();
            }
          });
      }, (err: any) => {
        Swal.fire('Fallo', 'Ocurrio un error al enviar la peticion, intentelo nuevamente', 'error');
      });
  }

  ticketRealizado(id) {
    this.tic.realizado(id)
      .subscribe((data) => {
        Swal.fire('Ticket Realizado',
          'Se cambio a estatus realizado',
          'success').then((result) => {
            if (result.value) {
              location.reload();
            }
          });
      }, (err: any) => {
        Swal.fire('Fallo', 'Ocurrio un error al actualizar la observacion', 'error');
      });
  }

  selectChangeHandler(event: any) {
    this.clienteselected = event.target.value;
  }

  buscartickets() {
    if (this.fechain == '' || this.fechafi == '') {
      Swal.fire("Aviso", "Selecciona fechas validas", "warning");
    } else if (this.fechain > this.fechafi) {
      Swal.fire("Aviso", "Elige una fecha de inicio menor a la fecha final", "warning");
    } else {
      if (this.clienteselected != '') {
        this.tic.buscadorCliente(this.fechain, this.fechafi, this.clienteselected)
          .subscribe((data) => {
            this.busqueda = data['rows'];
            this.cantidad = data['rows'].length;
          }, (err: any) => {
            Swal.fire("Aviso", "No se encontraron tickets con el cliente y margen de fechas seleccionadas", "info");
          });
      } else {
        this.tic.buscador(this.fechain, this.fechafi)
          .subscribe((data) => {
            this.busqueda = data['rows'];
            this.cantidad = data['rows'].length;
          }, (err: any) => {
            Swal.fire("Aviso", "No se encontraron tickets en el margen de fechas seleccionado", "info");
          });
      }
    }
  }

  historialticket(descripcion, estatus) {

    var st = '';
    if (estatus == 'realizado') {
      st = '<span class="badge badge-success">' + estatus + '</span>';
    } else {
      st = '<span class="badge badge-warning">' + estatus + '</span>';
    }

    Swal.fire({
      title: '<strong>Información del ticket</strong>',
      html:
        '<b>Estatus</b><br>' + st +
        '<strong><h3>Descripcion</h3></strong>' +
        descripcion,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fas fa-check-circle"></i> Aceptar',
      confirmButtonAriaLabel: 'Aceptar',

    })
  }

  Cerrar() {
    this.auth.logout();
  }

}
