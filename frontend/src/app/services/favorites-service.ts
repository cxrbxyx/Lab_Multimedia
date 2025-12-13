import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login-service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addFavorite(trackName: string, artistName: string, image: string, videoId?: string): Observable<any> {
    return this.http.post(this.apiUrl, { trackName, artistName, image, videoId }, { headers: this.getHeaders() });
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  removeFavoriteByTrack(trackName: string, artistName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/track?trackName=${encodeURIComponent(trackName)}&artistName=${encodeURIComponent(artistName)}`, { headers: this.getHeaders() });
  }

  checkFavorite(trackName: string, artistName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check?trackName=${encodeURIComponent(trackName)}&artistName=${encodeURIComponent(artistName)}`, { headers: this.getHeaders() });
  }
}
