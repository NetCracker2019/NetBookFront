import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {first} from "rxjs/operators";
import {AlertService} from "../_services/alert.service";
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css']
})
export class RecoveryPassComponent implements OnInit {


  public recoveryForm: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public returnUrl: string;
  public error: string = '';
  public token: string;

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

    if (this.recoveryForm.invalid || this.f.passwordFirst.value != 
    	this.f.passwordSecond.value) {
    	this.toastr.error(`Passwords do not match`);
      return;
    }

    this.loading = true;
    this.userService.recoveryPass(this.token, this.f.passwordFirst.value)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success(`Successful recovery pass`);	
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }

}
