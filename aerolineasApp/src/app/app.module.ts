import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { AeropuertosComponent } from './components/aeropuertos/aeropuertos.component';
import { AvionesComponent } from './components/aviones/aviones.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AerolineasComponent,
    AeropuertosComponent,
    AvionesComponent,
    VuelosComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
