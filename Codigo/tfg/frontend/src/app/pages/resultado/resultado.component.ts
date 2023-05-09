import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../../services/envio.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  public listaLugares: any = [];

  constructor(private envio: EnvioService) { }

  ngOnInit(): void {
    this.listaLugares = JSON.parse(localStorage.getItem('listaLugares') || '{}');
  }
}
