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

  // Cola de reproducción (Observable)
  private queueSubject = new BehaviorSubject<Track[]>([]);
  queue$ = this.queueSubject.asObservable();

  private currentIndexSubject = new BehaviorSubject<number>(-1);
  currentIndex$ = this.currentIndexSubject.asObservable();

  // Variable para guardar la instancia del reproductor de YouTube
  private player: any = null;

  // Cola de reproducción interna
  private queue: Track[] = [];
  private currentIndex: number = -1;

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

  // Reproducir una canción (limpia la cola anterior si es una selección directa)
  play(track: any) {
    this.queue = [track];
    this.currentIndex = 0;
    this.updateQueueState();
    this.loadTrack(track);
    this.checkQueueAndFill();
  }

  // Añadir a la cola manualmente
  addToQueue(track: any) {
    this.queue.push(track);
    this.updateQueueState();
    // Si no había nada sonando, empezar a reproducir
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
      this.updateQueueState();
      this.loadTrack(track);
      this.checkQueueAndFill();
    }
  }

  // Eliminar de la cola
  removeFromQueue(index: number) {
    if (index > -1 && index < this.queue.length) {
      this.queue.splice(index, 1);
      // Ajustar índice actual si es necesario
      if (index < this.currentIndex) {
        this.currentIndex--;
      } else if (index === this.currentIndex) {
        // Si borramos la que suena, pasamos a la siguiente o paramos
        if (this.queue.length > 0) {
            // Si hay más, reproducimos la que ocupó su lugar (o la siguiente)
            if (this.currentIndex >= this.queue.length) {
                this.currentIndex = 0; // Volver al principio si era la última
            }
            this.loadTrack(this.queue[this.currentIndex]);
        } else {
            this.currentIndex = -1;
            this.currentTrackSubject.next(null);
            this.isPlayingSubject.next(false);
            if (this.player) this.player.stopVideo();
        }
      }
      this.updateQueueState();
    }
  }

  // Limpiar cola
  clearQueue() {
    this.queue = [];
    this.currentIndex = -1;
    this.updateQueueState();
    this.currentTrackSubject.next(null);
    this.isPlayingSubject.next(false);
    if (this.player) this.player.stopVideo();
  }

  // Mover canción
  moveTrack(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= this.queue.length || toIndex < 0 || toIndex >= this.queue.length) return;
    
    const track = this.queue[fromIndex];
    this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, track);

    // Ajustar currentIndex
    if (this.currentIndex === fromIndex) {
      this.currentIndex = toIndex;
    } else if (this.currentIndex > fromIndex && this.currentIndex <= toIndex) {
      this.currentIndex--;
    } else if (this.currentIndex < fromIndex && this.currentIndex >= toIndex) {
      this.currentIndex++;
    }
    this.updateQueueState();
  }

  // Saltar a una canción específica de la cola
  jumpTo(index: number) {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      this.updateQueueState();
      this.loadTrack(this.queue[this.currentIndex]);
    }
  }

  private updateQueueState() {
    this.queueSubject.next([...this.queue]);
    this.currentIndexSubject.next(this.currentIndex);
  }

  // Cargar y reproducir la canción actual
  private loadTrack(track: any) {
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

        // 3. Guardar en historial
        this.musicService.addToHistory({
          name: track.name,
          artist: track.artist,
          image: track.image,
          videoId: response.videoId
        }).subscribe();
      },
      error: (err) => console.error('Error obteniendo video:', err)
    });
  }

  // Verificar si necesitamos añadir canciones automáticas
  private checkQueueAndFill() {
    // Si estamos en la última canción de la cola
    if (this.currentIndex >= this.queue.length - 1) {
      const current = this.queue[this.currentIndex];
      if (!current) return;

      // Buscar canciones del mismo artista
      this.musicService.searchTracks(current.artist).subscribe({
        next: (tracks) => {
          // Filtrar la canción actual y duplicados que ya estén en la cola
          const existingNames = new Set(this.queue.map(t => t.name));
          const candidates = tracks.filter(t => !existingNames.has(t.name));

          // Elegir 3 aleatorias
          const randomTracks = this.pickRandom(candidates, 3);
          
          // Añadir a la cola
          this.queue.push(...randomTracks);
          this.updateQueueState();
          console.log('Cola actualizada automáticamente:', this.queue);
        },
        error: (err) => console.error('Error rellenando cola:', err)
      });
    }
  }

  private pickRandom(arr: any[], count: number): any[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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

  next() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.updateQueueState();
      this.loadTrack(this.queue[this.currentIndex]);
      this.checkQueueAndFill(); // Verificar si necesitamos más después de avanzar
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateQueueState();
      this.loadTrack(this.queue[this.currentIndex]);
    }
  }
}
