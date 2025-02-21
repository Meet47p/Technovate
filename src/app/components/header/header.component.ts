// header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  email: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showLoginForm = false;
  showSignupForm = false;
  isLoggedIn = false;

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
  currentUser: User | null = null;

  showDropdown = false;

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    if (this.showLoginForm) {
      this.showSignupForm = false;
    }
    this.clearForms();
  }

  toggleSignupForm() {
    this.showSignupForm = !this.showSignupForm;
    if (this.showSignupForm) {
      this.showLoginForm = false;
    }
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
      this.currentUser = user;
      this.isLoggedIn = true;
      setTimeout(() => {
        this.showLoginForm = false;
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

    this.users.push({
      email: this.signupEmail,
      password: this.signupPassword,
      name: this.signupName,
    });

    this.signupMessage = { text: 'Successfully signed up!', type: 'success' };
    setTimeout(() => {
      this.showSignupForm = false;
      this.showLoginForm = true;
      this.clearForms();
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
    this.showDropdown = false;
  }

  toggleDropdown() {
    if (this.isLoggedIn) {
      this.showDropdown = !this.showDropdown;
    } else {
      this.toggleLoginForm();
    }
  }

  onLogout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.showDropdown = false;
  }
}
