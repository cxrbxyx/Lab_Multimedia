import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  register(bar: string, email: string, pwd1: string, pwd2: string, clientId: string, clientSecret: string) {
    let info = {
      bar: bar,
      email: email,
      pwd1: pwd1,
      pwd2: pwd2,
      clientId: clientId, // Importante: debe coincidir con el nombre en el Map del backend
      clientSecret: clientSecret
    };
    
    // Esperamos un texto o JSON, pero nos basta saber si es 200 OK
    return this.http.post(this.apiUrl + "/register", info, { responseType: 'text' as 'json' });
  }
  getUser(token: string): Observable<any> {
    return this.http.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}