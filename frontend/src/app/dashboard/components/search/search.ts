import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../../services/music-service';
import { PlayerService } from '../../../services/player-service'; // <--- Importar

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search {
  query: string = '';
  results: any[] = [];
  isLoading: boolean = false;

  constructor(
    private musicService: MusicService,
    private playerService: PlayerService // <--- Inyectar
  ) {}

  onSearch() {
    if (!this.query.trim()) return;

    this.isLoading = true;
    this.musicService.searchTracks(this.query).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error buscando música:', err);
        this.isLoading = false;
      }
    });
  }

  playTrack(track: any) {
    // Usar el servicio para iniciar la reproducción
    this.playerService.play(track);
  }
}
