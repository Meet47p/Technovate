// header.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  email: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() currentUser: User | null = null;
  @Input() isLoggedIn: boolean = false;
  @Output() logOut = new EventEmitter<void>();

  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onLogout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.showDropdown = false;
    this.logOut.emit();
  }
}
