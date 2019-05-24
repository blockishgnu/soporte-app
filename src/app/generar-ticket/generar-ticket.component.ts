import { Component, OnInit, Inject } from '@angular/core';
import { TicketsService } from "../tickets.service";
import Swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '../auth.service';


const URL = 'http://localhost:5000/api/file';
var id_ticket = 0;
declare var $: any;


export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-generar-ticket',
  templateUrl: './generar-ticket.component.html',
  styleUrls: ['./generar-ticket.component.css']
})
export class GenerarTicketComponent implements OnInit {
  tipo = '';
  descripcion = '';
  respuesta;
  pendientes = {};
  uploader: FileUploader;
  rutasArchivos = [];

  constructor(private tic: TicketsService, public auth: AuthService) { }

  ngOnInit() {

    this.tic.listarPendientes()
      //.map((response) => response.json())
      .subscribe((data) => {
        this.pendientes = data;
      });
    this.uploader = new FileUploader({ url: URL, additionalParameter: { id: id_ticket } });
  }

  generar() {
    if (this.tipo == '' && this.descripcion == '') {
      Swal.fire('Campos vacios', 'Debes llenar todos los campos', 'warning');
    } else {
      this.tic.crearticket(this.tipo, this.descripcion)
        .subscribe((data: any) => {
          id_ticket = data.id;
          this.uploader.uploadAll();
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var res = JSON.parse(response);
            this.tic.almacenarArchivos(id_ticket, res.name)
              .subscribe((data) => {
                console.log('FileUpload:uploaded');
              });
          };
          Swal.fire('Correcto', 'Se ha generado el ticket correctamente', 'success')
            .then((result) => {
              location.reload();
            })
        }, (err: any) => {
          Swal.fire('Fallo', 'Ocurrio un error al generar el ticket', 'error');
        });
    }
  }

  detalles(id, usuario, descripcion, fecha, observacion) {
    var archivos = '';
    this.tic.obtenerArchivos(id)
      .subscribe((data: any) => {

        if (data.Message == 'Not-found') {
          archivos = 'Sin archivos adjuntos';
        } else {
          this.rutasArchivos = data.rows;
          for (var i = 0; this.rutasArchivos.length > i; i++) {
            archivos = archivos + '<a href="http://localhost/soporte-app/backend/archivos/' +
              this.rutasArchivos[i].ruta + '" target="_blank"><i class="far fa-file-alt fa-lg"></i></a> ';
          }
        }


        let date = new Date(fecha);
        Swal.fire({
          title: '<strong>Detalles</strong>',
          html:
            'Fecha: <b>' + date + '</b>' +
            '<h5><b>Observaciones:</b></h5>' +
            observacion +
            '<br>' +
            '<h5><b>Descripcion del ticket</b></h5>' +
            '<textarea id="textOb" class="form-control" style="border: 1px solid #aaa;">' + descripcion +
            '</textarea> <br>' +
            '<hr style="border: 1px solid #aaa;">' +
            '<h5>Archivos adjuntos</h5>' +
            archivos +
            '<hr style="border: 1px solid #aaa;">',
          showCloseButton: true,
          showCancelButton: true,
          cancelButtonColor: '#ff0000',
          focusConfirm: false,
          confirmButtonText:
            '<i class="fas fa-paper-plane"></i> Enviar',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            '<i class="fas fa-window-close"></i> Cancelar',
          cancelButtonAriaLabel: 'Thumbs down',
        }).then((result) => {
          if (result.value) {
            const content = Swal.getContent()
            const $ = content.querySelector.bind(content)
            const observacion = $('#observacion');
            const texto = $("#textOb");
            this.actualizarDescripcion(id, texto.value);
          }
        });

      });
  }

  actualizarDescripcion(id, descripcion) {
    this.tic.agregarDescripcion(id, descripcion)
      .subscribe((data: any) => {
        Swal.fire('Correcto', 'Se envio la nueva descripcion correctamente', 'success');
        location.reload();
      }, (err: any) => {
        Swal.fire('Fallo', 'Ocurrio un error al guardar', 'error');
      });
  }

  Cerrar() {
    this.auth.logout();
  }

  openModal(id) {
    (<any>$('#ModalFile_' + id).modal('show'));
  }

  cargarArchivos(id) {

    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var res = JSON.parse(response);
      this.tic.almacenarArchivos(id, res.name)
        .subscribe((data) => {
          console.log('FileUpload:uploaded');
          if (this.uploader.progress == 100) {
            Swal.fire('Correcto', 'Se ha generado el ticket correctamente', 'success')
              .then((result) => {
                location.reload();
              });
          }
        });
    };


  }

  /**
  *@Describe  subir archivos con ng2File
  */

  //public uploader: FileUploader = new FileUploader({ url: URL, additionalParameter: { id: id_ticket } });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


}
