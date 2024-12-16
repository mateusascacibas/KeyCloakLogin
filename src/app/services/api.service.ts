import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja fornecido globalmente
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    const url = 'http://localhost:8080/protected-endpoint'; // A URL do seu endpoint
    return this.http.get<any>(url); // Fazendo uma requisição GET
  }
}
