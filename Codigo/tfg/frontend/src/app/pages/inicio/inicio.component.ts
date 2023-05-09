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
  public datosP = this.f.group({
    texto: ['', Validators.required],
    edad: ['',  Validators.required], 
    objetivo:['',  Validators.required]
  });

  public listaLugares:any = [];  
  public mensaje = '<h3>Rellena toda la información</h3>';


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
}
