import { RouterModule, Routes } from "@angular/router";
import { Component } from '@angular/core';
import { InicioComponent } from "./pages/inicio/inicio.component";

const app_routes: Routes = [
    { path: 'inicio', component: InicioComponent },
    { path: '**' , pathMatch: 'full', redirectTo: 'inicio'}
]

export const app_routing = RouterModule.forRoot(app_routes)

