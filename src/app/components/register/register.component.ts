import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (form.hasError('passwordMismatch'));
  }
}

export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  passMatch = true;
  matcher = new PasswordErrorStateMatcher();
  matcher2 = new EmailErrorStateMatcher();

  constructor(private router: Router,
              private authService: AuthService,
              private snackbarService: SnackbarService,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validators: [
        this.passwordsMatch('password', 'confirmPassword'),
      ]
    });
  }

  passwordsMatch(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) { return null; }
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);
      if (!password.value || !confirmPassword.value) {
        return null;
      }
      if (password.value !== confirmPassword.value) {
        this.password.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  privacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  login() {
    this.router.navigate(['login']);
  }

  async onSubmit() {
    try {
      this.loading = true;
      const formData = this.registerForm.getRawValue();
      await this.authService.register(formData);
      this.router.navigate(['verify-email']);
    } catch (err) {
      if (err.error && err.error.email) {
        this.snackbarService.showError(err.error.email);
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }
  }
}
