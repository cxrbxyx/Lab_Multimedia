import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { MusicService } from '../services/music-service';
import { PlayerService } from '../services/player-service';
import { Search } from './components/search/search';
import { Player } from './components/player/player';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Search, Player],
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

  constructor(
    private userService: UserService,
    private musicService: MusicService,
    private playerService: PlayerService,
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

  changeView(view: string) {
    this.currentView = view;
    if (view === 'home') {
      this.loadHistory();
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