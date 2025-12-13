import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../services/favorites-service';
import { PlayerService } from '../../../services/player-service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = true;

  constructor(
    private favoritesService: FavoritesService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading favorites', err);
        this.isLoading = false;
      }
    });
  }

  playTrack(fav: any) {
    const track = {
      name: fav.trackName,
      artist: fav.artistName,
      image: fav.image,
      videoId: fav.videoId
    };
    this.playerService.play(track);
  }

  removeFavorite(fav: any, event: Event) {
    event.stopPropagation(); // Prevent playing when clicking remove
    if (confirm(`¿Eliminar "${fav.trackName}" de favoritos?`)) {
      this.favoritesService.removeFavorite(fav.id).subscribe(() => {
        this.favorites = this.favorites.filter(f => f.id !== fav.id);
      });
    }
  }
}
