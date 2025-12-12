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
}