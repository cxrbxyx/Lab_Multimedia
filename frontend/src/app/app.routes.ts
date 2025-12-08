import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { PaymentsComponent } from './payments/payments';
import { Callback } from './callback/callback';
import { Home } from './home/home';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'payments', component: PaymentsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'callback', component: Callback },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }
];