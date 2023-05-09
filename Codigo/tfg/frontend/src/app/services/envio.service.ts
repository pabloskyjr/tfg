import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvioService {

  private apiUrl = 'http://localhost:5000/api/envio';

  public listaLugares: any = []

  constructor(private http: HttpClient) { }

  sendData(data: any) {
    console.log(data)
    return this.http.post(this.apiUrl, data);
  }
}