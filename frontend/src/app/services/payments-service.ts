import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  
  // Ajusta el puerto si tu backend usa otro (ej. 8080)
  private apiUrl = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) { }

  prepay(email: string, token: string, amount: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prepay?email=${email}&token=${token}&amount=${amount}`);
  }

  confirm(transactionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirm`, transactionId);
  }
}