import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Track } from '../../../services/player-service';

// Declaramos la variable global de YouTube
declare var YT: any;

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class Player implements OnInit {
  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  videoId: string | null = null;
  
  // Controla si el video se ve en grande
  @Input() isExpanded: boolean = false;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.currentTrack$.subscribe(t => this.currentTrack = t);
    this.playerService.isPlaying$.subscribe(p => this.isPlaying = p);
    
    this.playerService.videoId$.subscribe(id => {
      if (id && id !== this.videoId) {
        this.videoId = id;
        this.loadVideo(id);
      }
    });
  }

  loadVideo(id: string) {
    // Esperar a que la API de YouTube esté lista
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      setTimeout(() => this.loadVideo(id), 1000);
      return;
    }

    // Si ya existe el player, solo cargamos el video
    if (this.playerService['player']) {
      this.playerService['player'].loadVideoById(id);
    } else {
      // Crear nuevo player
      new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: id,
        playerVars: {
          'autoplay': 1,
          'controls': 0, // Sin controles de YT
          'modestbranding': 1
        },
        events: {
          'onReady': (event: any) => {
            this.playerService.setPlayer(event.target);
            event.target.playVideo();
          },
          'onStateChange': (event: any) => {
            // Sincronizar estado si el video termina o se pausa manualmente
            if (event.data === YT.PlayerState.PLAYING) {
               // Actualizar estado a playing si es necesario
            }
          }
        }
      });
    }
  }

  togglePlay() {
    this.playerService.togglePlay();
  }
  
  toggleExpand() {
    // Emitimos un evento o cambiamos una variable global para expandir
    // Por ahora lo haremos simple: inyectaremos este estado desde el dashboard
    const event = new CustomEvent('toggle-expand');
    window.dispatchEvent(event);
  }
}
