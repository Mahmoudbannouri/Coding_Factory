import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private toggleSidebar = new Subject<boolean>();
  toggleSidebar$ = this.toggleSidebar.asObservable();  // Observable for sidebar toggle

  private overlaySidebarToggle = new BehaviorSubject<boolean>(false);  // Default value as false
  overlaySidebarToggle$ = this.overlaySidebarToggle.asObservable();  // Observable for overlay sidebar toggle

  private toggleNotiSidebar = new BehaviorSubject<boolean>(false);  // Notification sidebar state
  toggleNotiSidebar$ = this.toggleNotiSidebar.asObservable();

  private notificationsSubject = new BehaviorSubject<{ title: string, message: string, icon?: string }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();  // Observable for notifications

  constructor() {}

  sendNotification(notification: { title: string, message: string, icon?: string }) {
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([notification, ...current]);  // Add new notification at the top
  }

  getNotificationCount(): number {
    return this.notificationsSubject.getValue().length;  // Get count of notifications
  }

  clearNotifications() {
    this.notificationsSubject.next([]);  // Clear all notifications
  }

  toggleSidebarSmallScreen(toggle: boolean) {
    this.toggleSidebar.next(toggle);  // Emit new state to toggle sidebar
  }

  overlaySidebartoggle(toggle: boolean) {
    this.overlaySidebarToggle.next(toggle);  // Emit state for overlay sidebar
  }

  toggleNotificationSidebar(toggle: boolean) {
    this.toggleNotiSidebar.next(toggle);  // Emit state for notification sidebar
  }
}
