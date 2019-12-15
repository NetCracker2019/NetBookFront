import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { v4 as uuid } from 'uuid';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-content-edit-profile',
  templateUrl: './content-edit-profile.component.html',
  styleUrls: ['./content-edit-profile.component.css']
})
export class ContentEditProfileComponent implements OnInit, OnDestroy {

  public user: User = {} as User;
  private login: string;
  private fileToUpload: File = null;
  public fileName = '';

  form: FormGroup;
  profileValidationMessages = {
    email: [
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'maxlength', message: 'Your password cannot be more than 15 characters long' }
    ],
    name: [
      { type: 'pattern', message: 'Your name must contain only numbers and letters' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Your name cannot be more than 20 characters long' }
    ],
    status: [
      { type: 'pattern', message: 'Your status must contain only numbers and letters' },
      { type: 'maxlength', message: 'Your status cannot be more than 20 characters long' }
    ],
    country: [
      { type: 'pattern', message: 'Country must contain only letters' },
      { type: 'maxlength', message: 'Country cannot be more than 20 characters long' }
    ],
    city: [
      { type: 'pattern', message: 'City must contain only letters' },
      { type: 'maxlength', message: 'City cannot be more than 20 characters long' }
    ],
    password: [
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'maxlength', message: 'Your password cannot be more than 15 characters long' }
    ],
  };

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.params.login;
    this.form = new FormGroup({

      email: new FormControl('', [
        Validators.pattern('^[_A-Za-z0-9-.]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]),
      name: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9_ ]+$'),
        Validators.minLength(2),
        Validators.maxLength(20)
      ]),
      status: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9_ ]+$'),
        Validators.maxLength(20)
      ]),
      city: new FormControl('', [
        Validators.pattern('^[a-zA-Z_ ]+$'),
        Validators.maxLength(20)
      ]),
      country: new FormControl('', [
        Validators.pattern('^[a-zA-Z_ ]+$'),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(18)
      ]),
      confirmPassword: new FormControl(),
      avatarFilePath: new FormControl(),
      sex: new FormControl()
    });



    this.authenticationService.refreshToken();

    this.userService.isEditable(this.login)
    .subscribe(
      data => {
        if (!data) { this.router.navigate([`/homeath/profile/${this.login}`]); }
      });

    this.userService.getUser(this.login)
      .subscribe(
        (data: User) => {
          this.user = data;
          this.fileName = this.user.avatarFilePath;
          this.form.controls.status.setValue(this.user.status);
          this.form.controls.name.setValue(this.user.firstName);
          this.form.controls.email.setValue(this.user.email);
          this.form.controls.country.setValue(this.user.country);
          this.form.controls.city.setValue(this.user.city);
          this.form.controls.sex.setValue(this.user.sex);
        },
        error => {
          this.toastr.info(error);
        });
  }

  ngOnDestroy() {
    this.removeTempImage();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    if ( this.fileToUpload != null) {
      const newFileName: string = uuid();
      this.userService.postFile(this.fileToUpload, newFileName).subscribe(
        () => {
          this.removeTempImage();
          this.fileName = newFileName;
        },
        error => {
          this.toastr.info(`Picture size must be < 1 MB`);
        });
    }
  }

  removeTempImage() {
    if (this.fileName !== this.user.avatarFilePath) {
      this.userService.removeFile(this.fileName)
        .subscribe(() => {});
    }
  }
  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

  edit() {
    this.user.firstName = this.form.controls.name.value;
    this.user.country = this.form.controls.country.value;
    this.user.city = this.form.controls.city.value;
    this.user.sex = this.form.controls.sex.value;
    this.user.email = this.form.controls.email.value;
    this.user.password = this.form.controls.password.value;
    this.user.status = this.form.controls.status.value;
    this. user.avatarFilePath = this.fileName;
    this.commitEditUser();
  }

  commitEditUser() {
    this.userService.edit(this.user)
      .subscribe(
        () => {
          this.toastr.success(`Profile successfully updated`);
          this.router.navigate([`/homeath/profile/${this.login}`]);
        },
        error => {
          this.toastr.info(error);
        });
  }
  goBack() {
    this.router.navigate([`/homeath/profile/${this.login}`]);
  }

}
