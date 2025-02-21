import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: AppComponent }, // AppComponent as the main content
  { path: '**', redirectTo: 'login' }, // Wildcard redirects to login
];
