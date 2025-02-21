// login.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  email: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<User>();

  showLoginForm = true;
  showSignupForm = false;

  // Form states
  loginEmail: string = '';
  loginPassword: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  signupName: string = '';

  // Form messages
  loginMessage = { text: '', type: '' };
  signupMessage = { text: '', type: '' };

  // Store registered users
  users: User[] = [];

  toggleLoginForm() {
    this.showLoginForm = true;
    this.showSignupForm = false;
    this.clearForms();
  }

  toggleSignupForm() {
    this.showSignupForm = true;
    this.showLoginForm = false;
    this.clearForms();
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.loginMessage = { text: 'Please fill in all fields', type: 'error' };
      return;
    }

    const user = this.users.find(
      (u) => u.email === this.loginEmail && u.password === this.loginPassword
    );

    if (user) {
      this.loginMessage = { text: 'Successfully logged in!', type: 'success' };
      setTimeout(() => {
        this.loginSuccess.emit(user);
        this.clearForms();
      }, 1500);
    } else {
      this.loginMessage = {
        text: 'Invalid credentials or user not found!',
        type: 'error',
      };
    }
  }

  onSignup() {
    if (!this.signupEmail || !this.signupPassword || !this.signupName) {
      this.signupMessage = { text: 'Please fill in all fields', type: 'error' };
      return;
    }

    if (this.users.some((u) => u.email === this.signupEmail)) {
      this.signupMessage = {
        text: 'User with this email already exists!',
        type: 'error',
      };
      return;
    }

    const newUser = {
      email: this.signupEmail,
      password: this.signupPassword,
      name: this.signupName,
    };
    this.users.push(newUser);
    this.signupMessage = { text: 'Successfully signed up!', type: 'success' };
    setTimeout(() => {
      this.toggleLoginForm();
    }, 1500);
  }

  clearForms() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.signupEmail = '';
    this.signupPassword = '';
    this.signupName = '';
    this.loginMessage = { text: '', type: '' };
    this.signupMessage = { text: '', type: '' };
  }
}
