import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EnvioService } from 'src/app/services/envio.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {
  public datosP = this.f.group({
    texto: [''],
    edad: [''], 
    objetivo:['']
  });

  public listaLugares:any = []

  constructor( private f: FormBuilder, private envio: EnvioService) { }

  ngOnInit(): void {
  }

  enviar(){
    this.envio.sendData(this.datosP.value)
    .subscribe((res:any) =>{

      const resultado = res['choices']['0']['message']['content']
      const splitted = resultado.split('\n\n', 5);
      const separacion=[];

      for(let i = 0 ; i<5 ; i++){
        separacion[i] = splitted[i].split(':', 1);
      }
      for(let i = 0 ; i<5 ; i++){
        this.listaLugares[i] = separacion[i]['0'].split('.', 2)[1];
      }
      
      for(let i = 0; i<5; i++){
        console.log(this.listaLugares[i]);
      }
    })
  }

  getLugares(){
    return this.listaLugares;
  }

}
