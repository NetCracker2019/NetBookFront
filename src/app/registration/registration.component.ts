import { Component, OnInit } from '@angular/core';
import {User} from "../_models";
import {UserService} from "../_services/user.service";
import {AlertService} from "../_services/alert.service";
import {Router} from "@angular/router";



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {


  user : User = new User();


  constructor(private userService: UserService,
              private router: Router,
              private alertService: AlertService
  ) {

  }

  ngOnInit() {
  }


  // registration(event) {
  //   event.preventDefault();
  //   const target = event.target;
  //   const firstname = target.querySelector('#name').value;
  //   const secondname = target.querySelector('#lname').value;
  //   const username = target.querySelector('#username').value;
  //   const password = target.querySelector('#passwords').value;
  //
  //   this.user.firstName = firstname;
  //   this.user.lastName = secondname;
  //   this.user.username = username;
  //   this.user.password = password;
  //
  //
  //
  //   this.userService.register(this.user)
  //     .subscribe(
  //       data => {
  //         //this.alertService.success('Registration successful', true);
  //         //this.router.navigate(['/']);
  //
  //       },
  //       error => {
  //         //this.alertService.error(error);
  //         //this.loading = false;
  //         console.log(error.name);
  //         console.log(error.message);
  //
  //       });
  // }


  model: any = {};
  loading = false;



  register() {
    this.loading = true;
    this.userService.register(this.model)
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
          console.log(data);
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
          this.loading = false;
        });
  }

}





