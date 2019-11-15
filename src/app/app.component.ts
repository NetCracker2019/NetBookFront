import { Component } from '@angular/core';
<<<<<<< HEAD
import {User} from "./_models";
import {Router} from "@angular/router";
import {AuthenticationService} from "./_services/authentication.service";
=======
import {Router} from '@angular/router';
import {AuthenticationService} from './_services/authentication.service';
>>>>>>> master

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // currentUser: User;

  constructor(
    // private router: Router,
    // private authenticationService: AuthenticationService
  ) {
<<<<<<< HEAD
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
=======
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
>>>>>>> master
  }

  // logout() {
  //   this.authenticationService.logoutuser();
  //   this.router.navigate(['/login']);
  // }
}
