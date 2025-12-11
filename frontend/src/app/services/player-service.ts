import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MusicService } from './music-service';

export interface Track {
  name: string;
  artist: string;
  image: string;
  videoId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  // Estado actual de la canción (para mostrar título y artista)
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  // Estado del video ID (para el iframe de YouTube)
  private videoIdSubject = new BehaviorSubject<string | null>(null);
  videoId$ = this.videoIdSubject.asObservable();

  constructor(private musicService: MusicService) {}

  play(track: any) {
    // 1. Actualizamos la info visual inmediatamente
    this.currentTrackSubject.next({
      name: track.name,
      artist: track.artist,
      image: track.image,
    });

    // 2. Pedimos el video al backend
    this.musicService.getVideoId(track.name, track.artist).subscribe({
      next: (response) => {
        console.log('Video ID recibido:', response.videoId);
        this.videoIdSubject.next(response.videoId);
      },
      error: (err) => console.error('Error obteniendo video:', err),
    });
  }
}
