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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GenerarTicketComponent } from './generar-ticket/generar-ticket.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuardService } from './guards/auth-guard.service';
import { RoleGuardService } from './guards/role-guard-service.service';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { RegistroUsuarioService } from './services/registro-usuario.service';
import { FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministradorComponent } from './administrador/administrador.component';


import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatTooltipModule,
  MatRippleModule,
  MatProgressBarModule,
  MatIconModule
} from '@angular/material';



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
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
    MatRippleModule,
    MatProgressBarModule,
    MatIconModule
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
