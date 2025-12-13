import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { MusicService } from '../services/music-service';
import { PlayerService } from '../services/player-service';
import { FavoritesService } from '../services/favorites-service';
import { Search } from './components/search/search';
import { Player } from './components/player/player';
import { FavoritesComponent } from './components/favorites/favorites';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Search, Player, FavoritesComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any = null;
  currentView: string = 'home';
  isPlayerExpanded: boolean = false;
  history: any[] = [];
  
  // Cola
  showQueue: boolean = false;
  queue: any[] = [];
  currentQueueIndex: number = -1;
  
  favoritesSet: Set<string> = new Set();

  constructor(
    private userService: UserService,
    private musicService: MusicService,
    private playerService: PlayerService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    // Recuperar usuario del localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  ngOnInit() {
    this.loadHistory();
    this.loadFavorites();
    
    // Suscribirse a la cola
    this.playerService.queue$.subscribe(q => this.queue = q);
    this.playerService.currentIndex$.subscribe(i => this.currentQueueIndex = i);
  }

  loadHistory() {
    this.musicService.getHistory().subscribe({
      next: (data) => this.history = data,
      error: (err) => console.error('Error cargando historial', err)
    });
  }

  loadFavorites() {
    this.favoritesService.getFavorites().subscribe({
      next: (favs) => {
        this.favoritesSet.clear();
        favs.forEach(f => this.favoritesSet.add(`${f.trackName}|${f.artistName}`));
      },
      error: (err) => console.error('Error cargando favoritos', err)
    });
  }

  changeView(view: string) {
    this.currentView = view;
    if (view === 'home') {
      this.loadHistory();
      this.loadFavorites();
    } else if (view === 'favorites') {
      this.loadFavorites();
    }
  }

  playTrack(track: any) {
    // Adaptar el objeto historial al formato que espera el player
    this.playerService.play({
      name: track.trackName,
      artist: track.artistName,
      image: track.image
    });
  }

  addToQueue(track: any, event: Event) {
    event.stopPropagation();
    this.playerService.addToQueue({
      name: track.trackName,
      artist: track.artistName,
      image: track.image
    });
    alert(`"${track.trackName}" añadida a la cola`);
  }

  getTrackKey(track: any): string {
    const name = track.trackName || track.name;
    const artist = track.artistName || track.artist;
    return `${name}|${artist}`;
  }

  isFavorite(track: any): boolean {
    return this.favoritesSet.has(this.getTrackKey(track));
  }

  toggleFavorite(track: any, event: Event) {
    event.stopPropagation();
    const name = track.trackName || track.name;
    const artist = track.artistName || track.artist;
    const image = track.image;
    const videoId = track.videoId;

    if (this.isFavorite(track)) {
      this.favoritesService.removeFavoriteByTrack(name, artist).subscribe({
        next: () => {
          this.favoritesSet.delete(this.getTrackKey(track));
          alert('Eliminado de favoritos 💔');
        },
        error: () => alert('Error al eliminar de favoritos')
      });
    } else {
      this.favoritesService.addFavorite(name, artist, image, videoId).subscribe({
        next: () => {
          this.favoritesSet.add(this.getTrackKey(track));
          alert('Añadido a favoritos ❤️');
        },
        error: (err) => {
           if (err.status === 409) alert('Ya está en tus favoritos');
           else alert('Error al añadir a favoritos');
        }
      });
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Escuchar el evento personalizado desde el Player
  @HostListener('window:toggle-expand')
  onToggleExpand() {
    this.isPlayerExpanded = !this.isPlayerExpanded;
  }

  @HostListener('window:toggle-queue')
  onToggleQueue() {
    this.showQueue = !this.showQueue;
  }

  // Métodos de la cola
  removeFromQueue(index: number) {
    this.playerService.removeFromQueue(index);
  }

  clearQueue() {
    if (confirm('¿Seguro que quieres borrar toda la cola?')) {
      this.playerService.clearQueue();
    }
  }

  moveTrack(fromIndex: number, toIndex: number) {
    this.playerService.moveTrack(fromIndex, toIndex);
  }

  jumpTo(index: number) {
    this.playerService.jumpTo(index);
  }
}