import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { AeropuertosComponent } from './components/aeropuertos/aeropuertos.component';
import { AvionesComponent } from './components/aviones/aviones.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';

const routes: Routes = [
  {path:'aerolineas', component:AerolineasComponent},
  {path:'aeropuertos', component:AeropuertosComponent},
  {path:'aviones', component:AvionesComponent},
  {path:'vuelos', component:VuelosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
