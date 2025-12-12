import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = 'http://localhost:8080/api/music';

  constructor(private http: HttpClient) {}

  // Helper para añadir el token a las cabeceras
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Buscar canciones (llama a tu backend -> Spotify)
  searchTracks(query: string, offset: number = 0): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?q=${query}&offset=${offset}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener ID de video (llama a tu backend -> YouTube)
  getVideoId(track: string, artist: string): Observable<{videoId: string}> {
    return this.http.get<{videoId: string}>(`${this.apiUrl}/play?track=${track}&artist=${artist}`, {
      headers: this.getHeaders()
    });
  }
}