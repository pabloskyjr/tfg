import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../../services/envio.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  public listaLugares: any = [];
  public resumenes: any = [];

  public datosP: any = this.f.group({
    lugar: ['', Validators.required],
  });
  

  constructor(private envio: EnvioService, private f: FormBuilder) { }

  ngOnInit(): void {
    this.listaLugares = JSON.parse(localStorage.getItem('listaLugares') || '{}');
    this.crearResumen()  
  }

  crearResumen(){
    for(let i = 0; i<5; i++){
      this.datosP.get('lugar').setValue(this.listaLugares[i])
      this.envio.sendSummary(this.datosP.value)
      .subscribe((res: any)=>{
        this.resumenes[i] = res['resumen']
      })
    }
    console.log(this.resumenes)
  }
}
