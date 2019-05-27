import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterfazComponent } from './interfaz/interfaz.component';
import { LoginComponent } from './login/login.component';
import { TicketsService } from "./tickets.service";
import { AuthService } from "./auth.service";
import { HttpModule } from '@angular/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { GenerarTicketComponent } from './generar-ticket/generar-ticket.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuardService } from './guards/auth-guard.service';
import { RoleGuardService } from './guards/role-guard-service.service';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { RegistroUsuarioService } from './services/registro-usuario.service';
import { FileUploadModule } from 'ng2-file-upload';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdministradorComponent } from './administrador/administrador.component';



@NgModule({
  declarations: [
    AppComponent,
    InterfazComponent,
    LoginComponent,
    NotFoundComponent,
    GenerarTicketComponent,
    NuevoUsuarioComponent,
    AdministradorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FileUploadModule,
    BrowserAnimationsModule
  ],
  providers: [
    TicketsService,
    AuthService,
    JwtHelperService,
    AuthGuardService,
    RoleGuardService,
    RegistroUsuarioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
