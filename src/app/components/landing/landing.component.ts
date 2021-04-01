import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  mobileMenu = false;

  constructor(private router: Router,
              private authService: AuthService) {

   }

  ngOnInit() {

  }

  login() {
    if (this.authService._user) {
      this.router.navigate(['pawpals'])
    } else {
      this.router.navigate(['login']);
    }
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
  }

  register() {
    this.mobileMenu = false;
    this.router.navigate(['register']);
  }

  accept() {
    localStorage.acceptedCookies = true;
    // this.acceptedCookiePolicy = true;
  }

  privacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  home() {
    this.mobileMenu = false;
    this.router.navigate(['']);
  }

  learnMore() {
    const height = window.innerHeight - 85;
    window.scrollBy(0, height);
  }
}
