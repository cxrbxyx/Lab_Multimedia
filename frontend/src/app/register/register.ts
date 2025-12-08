import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  barName: string = '';
  email: string = '';
  clientId: string = '';
  clientSecret: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  onRegister() {
    console.log('Intento de registro...');

    // Validación básica
    if (!this.barName || !this.email || !this.password || !this.confirmPassword || !this.clientId || !this.clientSecret) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = {
      name: this.barName,
      email: this.email,
      password: this.password,
      spotifyClientId: this.clientId,
      spotifyClientSecret: this.clientSecret,
    };

    console.log('Enviando datos al backend:', user);

    this.userService.register(this.barName, this.email, this.password,this.password, this.clientId, this.clientSecret).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.successMessage = 'Registro exitoso. Por favor, revisa tu email para confirmar tu cuenta.';
        this.isLoading = false;

        // Limpiar formulario
        this.barName = '';
        this.email = '';
        this.clientId = '';
        this.clientSecret = '';
        this.password = '';
        this.confirmPassword = '';
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en registro:', error);

        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. ¿Está encendido el Backend?';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error al registrarse. Intenta de nuevo';
        }
      },
    });
  }
}
