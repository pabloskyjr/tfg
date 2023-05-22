import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class EnvioService {

  private apiUrl = 'http://localhost:5000/api/envio';
  private urlPixabay = 'https://pixabay.com/api/';


  private apiKey = 'AIzaSyBiQfWPappgwFttfyX12zQPZkbmLUnNpDM';
  private cx = '22fdd3b56f2e545bc';
  private urlGoogle = `https://www.googleapis.com/customsearch/v1`;

  public listaLugares: any = []

  constructor(private http: HttpClient) { }

  sendData(data: any) {
    return this.http.post('http://localhost:5000/api/envio', data);
  }

  sendSummary(data: any) {
    console.log(data)
    return this.http.post('http://localhost:5000/api/resumen', data);
  }

  searchImage(query: string) {
    const url = `${this.urlGoogle}?key=${this.apiKey}&cx=${this.cx}&q=${encodeURIComponent(query)}&searchType=image&num=1`;
    console.log(url)
    return this.http.get(url);
  }
}