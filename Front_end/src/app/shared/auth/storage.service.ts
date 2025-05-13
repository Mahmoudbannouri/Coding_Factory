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

  // Get user ID
  public static getUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  // Retrieve user role (returns first role with brackets preserved)
  public static getUserRole(): string {
    const user = this.getUser();
    if (!user || !user.roles) return '';
    
    if (Array.isArray(user.roles)) {
      return user.roles[0]; // Return first role with brackets
    }
    return user.roles;
  }

  // Retrieve all roles as array (with brackets preserved)
  public static getUserRolesRaw(): string[] {
    const user = this.getUser();
    if (!user || !user.roles) return [];
    
    return Array.isArray(user.roles) ? user.roles : [user.roles];
  }

  // Retrieve all roles as array (with brackets cleaned)
  public static getUserRoles(): string[] {
    return this.getUserRolesRaw().map(role => 
      role.replace(/[\[\]]/g, '')
    );
  }

  // Check if admin is logged in (supports both "[ADMIN]" and "ADMIN" formats)
  public static isAdminLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === "ADMIN" || role === "[ADMIN]" || 
           this.getUserRoles().includes('ADMIN');
  }

  // Check if student is logged in
  public static isStudentLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === 'STUDENT' || role === '[STUDENT]' ||
           this.getUserRoles().includes('STUDENT');
  }

  // Check if partner is logged in
  public static isPartnerLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === 'PARTNER' || role === '[PARTNER]' ||
           this.getUserRoles().includes('PARTNER');
  }

  // Check if trainer is logged in
  public static isTrainerLoggedIn(): boolean {
    const role = this.getUserRole();
    return role?.replace(/[\[\]]/g, '') === 'TRAINER' ||
           this.getUserRoles().includes('TRAINER');
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

  // Debug method
  public static logAuthInfo(): void {
    console.log('User:', this.getUser());
    console.log('Raw Roles:', this.getUserRolesRaw());
    console.log('Cleaned Roles:', this.getUserRoles());
    console.log('Token exists:', this.hasToken());
  }
}