import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../tickets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  autorizaciones = [];
  rutasArchivos = [];
  historial = [];

  constructor(private tic: TicketsService) { }

  ngOnInit() {

    this.tic.listarAutorizaciones()
      .subscribe((data) => {
        this.autorizaciones = data['rows'];
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
                '<h5>Razon por la cual se rechaza</h5>' +
                '<textarea id="textOb" class="form-control" style="border: 1px solid #aaa;">' +
                '</textarea> <br>' +
                '<button id="aprobar" class="btn btn-success"><i class="fas fa-check-circle"></i> Aprobar</button>' +
                ' <button id="rechazar" class="btn btn-warning"><i class="fas fa-times-circle"></i> Rechazar</button>' +
                '<hr style="border: 1px solid #aaa;">' +
                '<h5>Archivos adjuntos</h5>' +
                archivos +
                '<hr style="border: 1px solid #aaa;">',
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: false,
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
                const aprobar = $('#aprobar');
                const texto = $("#textOb");
                const rechazar = $('#rechazar');

                aprobar.addEventListener('click', () => {
                  this.Aprobar(id);
                });
                rechazar.addEventListener('click', () => {
                  this.Rechazar(id, texto.value);
                });
              },
            }).then((result) => {
              if (result.value) {
                //this.ticketRealizado(id);
              }
            });
          });
      });
  }

  Aprobar(id) {
    this.tic.Aprobar(id)
      .subscribe((data) => {
        console.log("Aprobada :v");
        Swal.fire("Correcto",
          "Se aprobo el ticket correctamente",
          "success")
          .then((result) => {
            location.reload();
          });
      }, (err: any) => {
        Swal.fire("Error", "Ocurrio un error en la peticion", "error");
      });
  }

  Rechazar(id, descripcion) {
    this.tic.Rechazar(id, descripcion)
      .subscribe((data) => {
        console.log("Rechazada :'v");
        Swal.fire("Correcto",
          "Se rechazo el ticket",
          "success")
          .then((result) => {
            location.reload();
          });
      }, (err: any) => {
        Swal.fire("Error", "Ocurrio un error en la peticion", "error");
      });
  }

}
