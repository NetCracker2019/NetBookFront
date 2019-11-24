import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {User} from '../_models/interface';



@Component({
  selector: 'app-headerauth',
  templateUrl: './headerauth.component.html',
  styleUrls: ['./headerauth.component.css']
})
export class HeaderauthComponent implements OnInit {



  currentUser: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.currentUser = this.authenticationService.currentUserValue.username;
  }

  ngOnInit() {
  }



  logout() {
    this.authenticationService.logoutuser();
    this.router.navigate(['home/announcement']);
  }

}
