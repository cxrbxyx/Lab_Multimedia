import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { Search } from './components/search/search'; // <--- Importar
import { Player } from './components/player/player'; // <--- Importar

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Search, Player], // <--- Añadir Player
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user: any = null;
  currentView: string = 'home';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    // Recuperar usuario del localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  changeView(view: string) {
    this.currentView = view;
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}