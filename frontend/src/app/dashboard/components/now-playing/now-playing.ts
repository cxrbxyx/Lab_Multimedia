import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Track } from '../../../services/player-service';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './now-playing.html',
  styleUrls: ['./now-playing.css']
})
export class NowPlaying implements OnInit {
  currentTrack: Track | null = null;
  // Nota: El video real seguirá estando en el componente Player (footer)
  // Aquí solo mostraremos la info en grande o moveremos el video si queremos complicarnos mucho.
  // Para simplificar y que el audio no se corte, dejaremos el video en el footer pero lo haremos visible
  // O usaremos una imagen de alta calidad aquí.
  
  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });
  }
}
