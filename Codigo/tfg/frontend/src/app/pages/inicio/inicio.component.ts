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
    texto: ['']
  });
  constructor( private f: FormBuilder, private envio: EnvioService) { }

  ngOnInit(): void {
  }

  enviar(){
    console.log(this.datosP.value);
    this.envio.sendData(this.datosP.value)
    .subscribe((res:any) =>{
      console.log(res);
    })

  }

}
