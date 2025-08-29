import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services';
import { AuthRequest, User } from '../models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      @if (!userService.authenticated()) {
        <form (ngSubmit)="login()" class="login-form">
          <h2>Login</h2>

          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="credentials.username"
              required
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="credentials.password"
              required
              class="form-control"
            >
          </div>

          @if (error()) {
            <div class="error">{{ error() }}</div>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="btn btn-primary"
          >
            @if (loading()) {
              Logging in...
            } @else {
              Login
            }
          </button>
        </form>
      } @else {
        <div class="user-info">
          <h2>Welcome, {{ userService.user()?.username }}!</h2>
          <p>Email: {{ userService.user()?.email }}</p>
          <button (click)="logout()" class="btn btn-secondary">Logout</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      background: white;
    }

    .login-form h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .error {
      color: #dc3545;
      margin: 10px 0;
      padding: 8px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    .user-info {
      text-align: center;
    }

    .user-info h2 {
      color: #28a745;
      margin-bottom: 10px;
    }

    .user-info p {
      color: #666;
      margin-bottom: 20px;
    }
  `]
})
export class LoginComponent {
  readonly userService = inject(UserService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  credentials: AuthRequest = {
    username: '',
    password: ''
  };

  login(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error.set('Please enter both username and password');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService.authenticate(this.credentials).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Login successful, user state is already updated in the service
          this.credentials = { username: '', password: '' };
        } else {
          this.error.set(response.message || 'Login failed');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Login failed. Please try again.');
        this.loading.set(false);
        console.error('Login error:', err);
      }
    });
  }

  logout(): void {
    this.userService.logout();
  }
}
