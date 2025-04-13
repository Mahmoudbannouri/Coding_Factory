import { Injectable } from '@angular/core';

const USER_KEY = 'c_user';
const TOKEN_KEY = 'c_token';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Save user info
  public saveUser(user: any): void {
    // Ensure we're storing the critical fields
    const userData = {
      id: user.id,
      email: user.email,
      roles: user.roles || [user.role] // Handle both array and single role
    };
    window.localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }
  

  // Save token
  public saveToken(token: string): void {
    console.log('Saving token:', token);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  // Retrieve token (non-static version)
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  // Static version for token retrieval
  public static getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  // Check if a token exists (non-static)
  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Static version for token check
  public static hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Retrieve user info (non-static)
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Static version for user retrieval
  public static getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user data', e);
        return null;
      }
    }
    return null;
  }

  // Clear storage
  public clean(): void {
    window.localStorage.clear();
  }

  // Get user ID (fixed recursive call)
  public static getUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  // Retrieve user role (fixed implementation)
  public static getUserRole(): string {
    const user = this.getUser();
    if (!user || !user.roles) return '';
    
    // Handle both string and array roles
    if (Array.isArray(user.roles)) {
      return user.roles[0]; // Return first role
    }
    return user.roles;
  }

  // Check if admin is logged in (fixed bracket comparison)
  public static isAdminLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === "ADMIN" || role === "[ADMIN]";
  }

  // Check if student is logged in
  public static isStudentLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === 'STUDENT' || role === '[STUDENT]';
  }

  // Check if partner is logged in
  public static isPartnerLoggedIn(): boolean {
    const role = this.getUserRole();

    return role === 'PARTNER' || role === '[PARTNER]';
  }

  // Check if trainer is logged in
 // In storage.service.ts
 public static isTrainerLoggedIn(): boolean {
  const role = this.getUserRole();
  // Handle both "[TRAINER]" and "TRAINER" cases
  return role?.replace(/[\[\]]/g, '') === 'TRAINER';
}

  // Logout user
  public static logout(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }

  // Non-static logout
  public logout(): void {
    StorageService.logout();
  }
}