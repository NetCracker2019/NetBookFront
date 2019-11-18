import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {first} from 'rxjs/operators';
import {User} from '../_models/interface';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {


  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  accountValidationMessages = {
    userName: [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 4 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 15 characters long' },
    ],
    userPassword: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 2 characters long' },
      { type: 'maxlength', message: 'Your password cannot be more than 15 characters long' }
    ],
  };


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService

  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/homeath']);
    }

    this.loginForm = new FormGroup({

      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      userPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15)])
    });
  }

  ngOnInit() {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/homeath';
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  login() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authenticationService.login(this.f.userName.value, this.f.userPassword.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
