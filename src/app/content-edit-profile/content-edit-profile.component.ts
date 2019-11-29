import { Component, OnInit } from '@angular/core';
import {User} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { v4 as uuid } from 'uuid';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-content-edit-profile',
  templateUrl: './content-edit-profile.component.html',
  styleUrls: ['./content-edit-profile.component.css']
})
export class ContentEditProfileComponent implements OnInit {

  public user: User = {} as User;
  private login: string;
  private fileToUpload: File = null;
  private fileName: string;

  form: FormGroup;
  profileValidationMessages = {
    email: [
      { type: 'pattern', message: 'Enter a valid email' }
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
   private alertService: AlertService) {
    
    this.login = activatedRoute.snapshot.params['login'];
    this.form = new FormGroup({

      email: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]),
      password: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(18)
      ]),
      country: new FormControl(),
      city: new FormControl(),
      firstName: new FormControl(),
      avatarFilePath: new FormControl(),
      status: new FormControl(),
      sex: new FormControl()
    });
    this.authenticationService.refreshToken();
  }

  ngOnInit() {
  	if(this.authenticationService.currentUserValue.username != this.login){
      this.router.navigate(['/homeath/profile/' + this.login]);
    }
  	this.userService.getUser(this.login)
      .subscribe(
        (data : User) => {
          this.user = data;
        },
        (error) => {
          this.alertService.error("Не вдалося завантажити інформацію");
        });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }


  getPhoto(imageName: string) {
        return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

  edit() {
    this.user.firstName = this.form.controls.firstName.value;
    this.user.country = this.form.controls.country.value;
    this.user.city = this.form.controls.city.value;
    this.user.sex = this.form.controls.sex.value;
    this.user.email = this.form.controls.email.value;
    this.user.password = this.form.controls.password.value;
    this.user.status = this.form.controls.status.value;
    if(this.fileToUpload != null){
      this.fileName = uuid();
    }
    this.user.avatarFilePath = this.fileName;

    this.userService.postFile(this.fileToUpload, this.fileName).subscribe(data => {
      }, error => {
        this.alertService.error("От халепа");
      });

    this.userService.edit(this.user)
      .subscribe(
        data => {
          this.alertService.success('Successful', true);
          this.router.navigate(['/homeath/profile/' + this.login]);
        },
        (error) => {
          this.alertService.error("От халепа");
        });
  }
  goBack(){
    this.router.navigate(['/homeath/profile/' + this.login]);
  }

}
