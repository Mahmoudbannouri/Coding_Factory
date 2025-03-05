import { Injectable } from '@angular/core';

const USER = 'c_user';
const TOKEN = 'c_token';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Save user info
  public saveUser(user: any) {
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  // Save token
  public saveToken(token: string) {
    console.log('Saving token:', token);
    window.localStorage.setItem(TOKEN, token);
  }

  // Retrieve token
  static getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }

  // Check if a token exists
  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Retrieve user info
  static getUser(): any | null {
    const user = window.localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  // Retrieve user role (Fixed: Convert string role to enum format)
  static getUserRole(): string {
    const user = this.getUser();
    if (user && user.role) {  // Ensure role is properly accessed
      return user.role;
    }
    return '';
  }

  // Check if an admin is logged in
  static isAdminLoggedIn(): boolean {
    return this.getUserRole() === "[ADMIN]";
  }

  // Check if a student is logged in
  static isStudentLoggedIn(): boolean {
    return this.getUserRole() === 'STUDENT';
  }

  // Check if a partner is logged in
  static isPartnerLoggedIn(): boolean {
    return this.getUserRole() === 'PARTNER';
  }

  // Check if a trainer is logged in
  static isTrainerLoggedIn(): boolean {
    return this.getUserRole() === 'TRAINER';
  }

  // Logout user by removing token and user info from local storage
  static logout() {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
