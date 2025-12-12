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
  styleUrls: ['./search.css'],
})
export class Search {
  query: string = '';
  results: any[] = [];
  isLoading: boolean = false;
  offset: number = 0;

  constructor(private musicService: MusicService, private playerService: PlayerService) {}

  onSearch() {
    if (!this.query.trim()) return;

    this.isLoading = true;
    this.offset = 0; // Reset offset
    this.results = []; // Clear previous results

    this.loadTracks();
  }

  loadMore() {
    this.offset += 10;
    this.isLoading = true;
    this.loadTracks();
  }

  private loadTracks() {
    this.musicService.searchTracks(this.query, this.offset).subscribe({
      next: (data) => {
        this.results = [...this.results, ...data]; // Append new results
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error buscando música:', err);
        this.isLoading = false;
      },
    });
  }

  playTrack(track: any) {
    // Usar el servicio para iniciar la reproducción
    this.playerService.play(track);
  }

  addToQueue(track: any, event: Event) {
    event.stopPropagation(); // Evitar que se dispare el click de la tarjeta (play)
    this.playerService.addToQueue(track);
    // Opcional: Mostrar feedback visual (toast, alerta, etc.)
    alert(`"${track.name}" añadida a la cola`);
  }
}
