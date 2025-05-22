import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { RegistroEventosComponent } from './screens/registro-eventos/registro-eventos.component';

const routes: Routes = [
  { path:'', component: LoginScreenComponent, pathMatch: 'full'},
  { path:'registro-usuarios', component: RegistroUsuariosScreenComponent, pathMatch: 'full'},
  { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },
  { path:'home', component: HomeScreenComponent, pathMatch: 'full'},
   { path: 'registro-eventos', component: RegistroEventosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
