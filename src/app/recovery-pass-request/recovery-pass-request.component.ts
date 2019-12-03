import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {first} from "rxjs/operators";
import {AlertService} from "../_services/alert.service";
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recovery-pass-request',
  templateUrl: './recovery-pass-request.component.html',
  styleUrls: ['./recovery-pass-request.component.css']
})
export class RecoveryPassRequestComponent implements OnInit {


  public recoveryForm: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public returnUrl: string;
  public error: string = '';

  constructor(
  	private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private toastr: ToastrService) {

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
    this.userService.recoveryPassRequest(this.f.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success(`Email was sent`);	
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }

}

