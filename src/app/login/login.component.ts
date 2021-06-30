import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, HttpService, AlertService, LoaderService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  isSubmitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  get formControls() { return this.loginForm.controls; }

  login(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.alertService.error('One or more fields have an error. Please check and try again.', '');
      return;
    }
    this.loading = true;
    this.loaderService.start();
    /* this.httpService.post('login/checkLogin/1625030585884', {
      username: this.formControls.email.value,
      password: this.formControls.password.value
    }).subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.alertService.error(error, '');
        this.loading = false;
      }); */
    this.authenticationService.login(this.formControls.email.value, this.formControls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loaderService.stop();
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loaderService.stop();
          this.alertService.error(error);
          this.loading = false;
        });
  }
}