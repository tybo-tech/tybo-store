import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User, AuthRequest, AuthResponse, PasswordUpdateRequest, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isAuthenticated = signal<boolean>(false);

  // Public readonly signals
  readonly user = this.currentUser.asReadonly();
  readonly authenticated = this.isAuthenticated.asReadonly();

  /**
   * Authenticate user
   */
  authenticate(credentials: AuthRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/users/authenticate.php', credentials)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.user) {
            this.setCurrentUser(response.user);
            if (response.token) {
              localStorage.setItem('auth_token', response.token);
            }
          }
        })
      );
  }

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users/list.php');
  }

  /**
   * Get a specific user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.get<User>('/users/get.php', { id });
  }

  /**
   * Create a new user
   */
  createUser(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.post<ApiResponse<User>>('/users/save.php', user);
  }

  /**
   * Update an existing user
   */
  updateUser(user: User): Observable<ApiResponse<User>> {
    return this.post<ApiResponse<User>>('/users/save.php', user);
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/users/delete.php', { id });
  }

  /**
   * Update user password
   */
  updatePassword(passwordData: PasswordUpdateRequest): Observable<ApiResponse> {
    return this.put<ApiResponse>('/users/update-password.php', passwordData);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('auth_token');
  }

  /**
   * Set current user (private method)
   */
  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated() && !!localStorage.getItem('auth_token');
  }

  /**
   * Get auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Initialize user session from stored token
   */
  initializeSession(): void {
    const token = this.getAuthToken();
    if (token) {
      // You might want to validate the token with the backend here
      this.isAuthenticated.set(true);
    }
  }
}
