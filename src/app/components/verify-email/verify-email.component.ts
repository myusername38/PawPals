import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { SnackbarService } from '../../services/snackbar.service'
import { Router,  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  loading = false;
  oobCode = '';

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.oobCode) {
        this.oobCode = params.oobCode;
      }
    });
   }

  ngOnInit(): void {
    this.verifyEmail(this.oobCode)
  }

  async verifyEmail(oobCode) {
    try {
      this.loading = true;
      console.log(oobCode);
      const responce = await this.authService.verifyEmail(oobCode);
      this.router.navigate(['']);
      console.log(responce);
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }
}
