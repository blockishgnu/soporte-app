import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { InterfazComponent } from './interfaz/interfaz.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GenerarTicketComponent } from './generar-ticket/generar-ticket.component';
import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';
import { RoleGuardService as RoleGuard } from './guards/role-guard-service.service';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'nuevo-usuario', component: NuevoUsuarioComponent},
  { path: 'interfaz', component: InterfazComponent, canActivate: [RoleGuard], data: { expectedRole: 'administrador' } },
  { path: 'generar-ticket', component: GenerarTicketComponent, canActivate: [RoleGuard], data: { expectedRole: 'cliente' } },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
