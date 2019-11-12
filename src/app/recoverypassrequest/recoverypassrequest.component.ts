import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {first} from "rxjs/operators";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-recoverypassrequest',
  templateUrl: './recoverypassrequest.component.html',
  styleUrls: ['./recoverypassrequest.component.css']
})
export class RecoverypassrequestComponent implements OnInit {


  recoveryForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
  	private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService	
  ) {

  }

  ngOnInit() {

    this.recoveryForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/homeath';
  }


  // convenience getter for easy access to form fields
  get f() { return this.recoveryForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.recoveryForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.recoverypassrequest(this.f.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Email was sent', true);	
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}

