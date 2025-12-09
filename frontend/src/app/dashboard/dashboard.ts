import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user: any = null;
  currentView: string = 'home';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  changeView(view: string) {
    this.currentView = view;
  }

}