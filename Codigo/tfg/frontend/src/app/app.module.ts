import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { app_routing } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    app_routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
