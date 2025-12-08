import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../payments-service'; // Tu servicio existente

// Declaramos la variable global de Stripe
declare var Stripe: any;

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit {
  
  // CLAVE PÚBLICA DE STRIPE (Usa la tuya de prueba pk_test_...)
  stripe = Stripe('pk_test_51SIV1j0Op3tHBSoLMp0bkfCdzgrL8EJ5BN0p5uygmGd6wPylMTRM3jCdV5YnafbHKj3BX7uBngFie8oNQMAJdjyW00P0gQ9vWO'); 
  
  card: any;
  email: string = '';
  token: string = '';
  amount: number = 1000; // 10.00€
  
  message: string = '';
  isProcessing: boolean = false;
  transactionDetails: any;

  constructor(
    private route: ActivatedRoute,
    private paymentsService: PaymentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
      
      console.log('Datos recibidos:', this.email, this.token);

      if (this.email && this.token) {
        this.setupStripe();
      } else {
        this.message = "Enlace inválido. Faltan datos de verificación.";
      }
    });
  }

  setupStripe() {
    // Esperamos a que el DOM cargue un poco para montar el elemento
    setTimeout(() => {
      const elements = this.stripe.elements();
      const style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': { color: '#aab7c4' }
        },
        invalid: { color: '#fa755a', iconColor: '#fa755a' }
      };

      this.card = elements.create('card', { style: style });
      // Montamos la tarjeta en el div con id="card-element" del HTML
      this.card.mount('#card-element');

      this.card.on('change', (event: any) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError!.textContent = event.error.message;
        } else {
          displayError!.textContent = '';
        }
      });
    }, 100);
  }

  // 1. Iniciar Pago (Llama al backend para obtener clientSecret)
  iniciarPago() {
    this.isProcessing = true;
    this.message = "Iniciando transacción...";

    // Enviar token junto con email y amount
    this.paymentsService.prepay(this.email, this.token, this.amount).subscribe({
      next: (response) => {
        this.transactionDetails = response;
        const stripeData = JSON.parse(this.transactionDetails.data);
        this.confirmarPagoConStripe(stripeData.client_secret);
      },
      error: (err) => {
        this.isProcessing = false;
        if (err.status === 401) {
          this.message = "Token inválido o expirado. Por favor, solicita un nuevo enlace de registro.";
        } else {
          this.message = "Error al contactar con el servidor: " + err.message;
        }
      }
    });
  }

  // 2. Confirmar pago en Stripe
  async confirmarPagoConStripe(clientSecret: string) {
    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: { email: this.email }
      }
    });

    if (result.error) {
      this.isProcessing = false;
      this.message = "Error en el pago: " + result.error.message;
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        this.finalizarRegistro();
      }
    }
  }

  // 3. Finalizar en backend
  finalizarRegistro() {
    this.message = "Pago exitoso. Activando cuenta...";
    
    this.paymentsService.confirm(this.transactionDetails.id).subscribe({
      next: () => {
        this.message = "¡Cuenta activada! Redirigiendo...";
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isProcessing = false;
        this.message = "Error al activar la cuenta.";
      }
    });
  }
}