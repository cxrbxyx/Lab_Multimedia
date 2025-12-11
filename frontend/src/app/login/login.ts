import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login(this.email, this.password).subscribe({
      next: (response: any) => { // Usamos any o la interfaz LoginResponse
        console.log('Login exitoso:', response);
        
        // --- AÑADIR ESTAS LÍNEAS ---
        // Guardamos el token donde MusicService lo espera
        localStorage.setItem('token', response.token);
        
        // Guardamos datos del usuario para el Dashboard
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          barName: response.barName,
          clientId: response.clientId,
          username: response.barName // Para que se vea el nombre en el menú
        }));
        // ---------------------------

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo';
        }
      }
    });
  }
}
