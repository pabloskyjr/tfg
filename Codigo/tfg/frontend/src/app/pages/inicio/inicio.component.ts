import { Component, OnInit  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EnvioService } from 'src/app/services/envio.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {
  public datosP: any = this.f.group({
    texto: ['', Validators.required],
    edad: ['',  Validators.required], 
    objetivo:['',  Validators.required]
  });

  public listaLugares:any = [];  
  public pintarCat = -1;
  public pintarEdad = -1;

  constructor( private f: FormBuilder, private envio: EnvioService, private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('listaLugares', ' ')
  }

  enviar(){
    if(this.datosP.valid ){
      this.envio.sendData(this.datosP.value)
      .subscribe((res:any) =>{
  
        const resultado = res['choices']['0']['message']['content']
        console.log(resultado);
        const splitted = resultado.split(/\n+/, 8);
        console.log(splitted)
  
        for(let i = 0 ; i<8 ; i++){
          this.listaLugares[i] = splitted[i].split(/[.:]/)[1];
        }
        
        console.log(this.listaLugares)
        localStorage.setItem('listaLugares', JSON.stringify( this.listaLugares ));
        this.router.navigate(['resultado']);
      })
    }else{
         Swal.fire(
          {icon: 'error', 
          title: 'Algo fue mal', 
          text: 'Rellena toda la información'
        });
    }
  }

  getLugares(){
    return this.listaLugares;
  }

  seleccionarBoton(valor: any){
    switch(valor){
      case 0: 
        this.datosP.get('objetivo').setValue('comida');
        this.pintarCat = 0; 
      break;
      case 1: 
        this.datosP.get('objetivo').setValue('cultura');
        this.pintarCat = 1;
      break;
      case 2: 
        this.datosP.get('objetivo').setValue('en familia');
        this.pintarCat = 2;
      break;
      case 3: 
        this.datosP.get('objetivo').setValue('deporte');
        this.pintarCat = 3;
      break;
    }
  }

  seleccionarEdad(valor:any){
    switch(valor){
      case 0:
        this.datosP.get('edad').setValue(20);
        this.pintarEdad = 0; 
      break;
      case 1:
        this.datosP.get('edad').setValue(30);
        this.pintarEdad = 1; 
      break;
      case 2: 
        this.datosP.get('edad').setValue(40);
        this.pintarEdad = 2; 
      break;
      case 3: 
        this.datosP.get('edad').setValue(60);
        this.pintarEdad = 3; 
      break;
      case 4: 
        this.datosP.get('edad').setValue(65);
        this.pintarEdad = 4; 
      break;
    }
  }
}
