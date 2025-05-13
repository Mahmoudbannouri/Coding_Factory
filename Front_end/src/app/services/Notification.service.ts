import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  title: string;
  message: string;
  icon: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  storageKey = 'notifications'; // Key for storing in localStorage

  constructor() {
    // Load notifications from localStorage on service initialization
    const storedNotifications = this.getNotifications();
    this.notificationsSubject.next(storedNotifications);
  }

  // Get notifications from localStorage (initially)
  getNotifications(): AppNotification[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Add a new notification and update localStorage and BehaviorSubject
  addNotification(notification: AppNotification) {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [...currentNotifications, notification];
    this.notificationsSubject.next(updatedNotifications); // Emit new array
    this.saveNotificationsToStorage(updatedNotifications); // Save to localStorage
  }

  // Clear notifications from localStorage and BehaviorSubject
  clearNotifications() {
    this.notificationsSubject.next([]);  // Clear the BehaviorSubject
    localStorage.removeItem(this.storageKey); // Clear from localStorage
  }

  // Delete a specific notification and update localStorage and BehaviorSubject
  deleteNotification(index: number) {
    const current = this.notificationsSubject.value;
    current.splice(index, 1);
    this.notificationsSubject.next(current);  // Notify subscribers
    this.saveNotificationsToStorage(current); // Save the updated list
  }

  // Helper function to save notifications to localStorage
  private saveNotificationsToStorage(notifications: AppNotification[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
  }
}
