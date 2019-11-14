import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {first} from "rxjs/operators";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css']
})
export class RecoveryPassComponent implements OnInit {


  recoveryForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  token: string;

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
      passwordFirst: ['', Validators.required],
      passwordSecond: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/homeath';

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

    });
  }


  // convenience getter for easy access to form fields
  get f() { return this.recoveryForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.recoveryForm.invalid || this.f.passwordFirst.value != 
    	this.f.passwordSecond.value) {
    	this.alertService.error('Passwords do not match', true);
      return;
    }

    this.loading = true;
    this.userService.recoveryPass(this.token, this.f.passwordFirst.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Successful recovery pass', true);	
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
