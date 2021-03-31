import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  user = null;
  routeToLoad = '';
  params = null;

  constructor(private authService: AuthService, private router: Router, private snackbar: SnackbarService) {
    this.authService.userSubject.subscribe(user => {
      this.user = user;
      console.log(user)
      if (this.routeToLoad) {
        const route = this.routeToLoad;
        this.routeToLoad = '';
        if (this.params) {
          const queryParams = this.params;
          this.router.navigate([route], { queryParams });
          this.params = null;
        } else {
          this.router.navigate([route]);
        }
      }
    });
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /* This is one weird work around to get the state to load and redirect unauthorized people */
    const result = this.checkRoute(route, state);
    if (!result && this.routeToLoad === '') { // if not reloading to get the token
      this.router.navigate(['']);
    }
    return result;
  }

  checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.user) {
      this.routeToLoad = state.url;
      this.params = route.queryParams;
      const endOfUrl = this.routeToLoad.indexOf('?');
      if (endOfUrl !== -1) {
        this.routeToLoad = this.routeToLoad.substr(0, endOfUrl);
      }
    }
    // if (!this.authService.currentUserEmailVerified()) {
    if (!this.user) {
      if (!this.authService.token) {
        return;
      }
      this.router.navigate(['verify-email']);
      return false;
    } else {
      return true;
    }
  }
}
