import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Track } from '../../../services/player-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class Player implements OnInit {
  currentTrack: Track | null = null;
  videoUrl: SafeResourceUrl | null = null;

  constructor(
    private playerService: PlayerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Suscribirse a cambios de canción (título/artista)
    this.playerService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    // Suscribirse a cambios de video (YouTube)
    this.playerService.videoId$.subscribe(videoId => {
      if (videoId) {
        // Creamos la URL segura para el iframe con autoplay
        const url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }
}
