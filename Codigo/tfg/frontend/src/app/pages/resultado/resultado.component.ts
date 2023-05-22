import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../../services/envio.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { google } from 'googleapis';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  public cont: any = 4;
  public searchQuery = '';
  public imageUrl: any[] = [];
  public ciudad = localStorage.getItem('ciudad');


  public listaLugares: any = [];
  public resumenes: any = [];

  public datosP: any = this.f.group({
    lugar: ['', Validators.required],
    ciudad: ['', Validators.required],
  });
  

  constructor(private envio: EnvioService, private f: FormBuilder, private http: HttpClient) { 
  }

  ngOnInit(): void {
    this.listaLugares = JSON.parse(localStorage.getItem('listaLugares') || '{}');
    this.crearResumen() 
    /*for(let i=0; i<this.listaLugares.length; i++){
      this.searchImages(this.listaLugares[i])
    }*/
      console.log(this.imageUrl)

    localStorage.setItem('imagenes', JSON.stringify(this.imageUrl))

  }

  crearResumen(){
    for(let i = 0; i<8; i++){
      this.datosP.get('lugar').setValue(this.listaLugares[i])
      this.datosP.get('ciudad').setValue(localStorage.getItem('ciudad'))
      this.envio.sendSummary(this.datosP.value)
      .subscribe((res: any)=>{
        this.resumenes[i] = res['resumen']
      })
    }
    console.log(this.resumenes)
  }

  searchImages(query: string) {
    this.envio.searchImage(query)
      .subscribe((response: any) => {
        if (response.items && response.items.length > 0) {
          this.imageUrl.push(response.items[0].link);
        }
      });
  }

  cambiarLugar(indice: any){
    this.listaLugares[indice] = this.listaLugares[this.cont]
    this.imageUrl[indice] = this.imageUrl[this.cont]
    this.resumenes[indice] = this.resumenes[this.cont]
    this.cont++
    if(this.cont >= 7){
      this.cont = 7
    }
  }
}
