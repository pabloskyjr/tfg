import { RouterModule, Routes } from "@angular/router";
import { Component } from '@angular/core';
import { InicioComponent } from "./pages/inicio/inicio.component";
import { ResultadoComponent } from "./pages/resultado/resultado.component";

const app_routes: Routes = [
    { path: 'resultado', component: ResultadoComponent },
    { path: 'inicio', component: InicioComponent },
    { path: '**' , pathMatch: 'full', redirectTo: 'inicio'},
]

export const app_routing = RouterModule.forRoot(app_routes)

