import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'app/shared/auth/storage.service'; // Ensure the correct path

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (StorageService.hasToken()) {
      // Admins should access Dashboard 1 only
      if (StorageService.isAdminLoggedIn()) {
        if (next.url[0]?.path !== 'dashboard1') {
          this.router.navigateByUrl("/dashboard/dashboard1");
          return false;
        }
      } 
      // Other users go to Dashboard 2
      else {
        if (next.url[0]?.path !== 'dashboard2') {
          this.router.navigateByUrl("/dashboard/dashboard2");
          return false;
        }
      }
    } else {
      // Redirect unauthorized users to login
      this.router.navigate(['/pages/login']);
      return false;
    }

    return true;
  }
}
