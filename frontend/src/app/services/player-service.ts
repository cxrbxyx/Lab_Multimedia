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
  providedIn: 'root'
})
export class PlayerService {
  // Estado actual de la canción (para mostrar título y artista)
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  // Estado del video ID (para el iframe de YouTube)
  private videoIdSubject = new BehaviorSubject<string | null>(null);
  videoId$ = this.videoIdSubject.asObservable();

  // Estado de reproducción (para cambiar el icono play/pause)
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  // Variable para guardar la instancia del reproductor de YouTube
  private player: any = null;

  constructor(private musicService: MusicService) {
    // Cargar la API de YouTube IFrame globalmente
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

  // Método para guardar la referencia al reproductor cuando se crea
  setPlayer(player: any) {
    this.player = player;
  }

  play(track: any) {
    // 1. Actualizamos la info visual inmediatamente
    this.currentTrackSubject.next({
      name: track.name,
      artist: track.artist,
      image: track.image
    });

    // 2. Pedimos el video al backend
    this.musicService.getVideoId(track.name, track.artist).subscribe({
      next: (response) => {
        console.log('Video ID recibido:', response.videoId);
        this.videoIdSubject.next(response.videoId);
        this.isPlayingSubject.next(true);
      },
      error: (err) => console.error('Error obteniendo video:', err)
    });
  }

  togglePlay() {
    if (this.player) {
      const state = this.player.getPlayerState();
      if (state === 1) { // Playing
        this.player.pauseVideo();
        this.isPlayingSubject.next(false);
      } else {
        this.player.playVideo();
        this.isPlayingSubject.next(true);
      }
    }
  }

  // Métodos placeholder para siguiente/anterior (requeriría una cola de reproducción)
  next() { console.log('Siguiente canción...'); }
  prev() { console.log('Canción anterior...'); }
}
